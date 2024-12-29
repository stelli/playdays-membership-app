"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Member, MemberSearchResults } from "../types";
import { db } from "../../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

type SearchMember = Omit<Member, "type">;
export default function SearchMembers() {
  const [member, setMember] = useState<SearchMember>({
    name: "",
    phone: "",
    dateOfBirth: "",
    customMemberId: "",
  });

  const [searchMemberResult, setSearchMemberResult] = useState<
    MemberSearchResults[] | null
  >(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    const collectionRef = collection(db, "members"); // Reference to the Firestore collection
    let filters: any[] = []; // Array to hold the filters

    // Add filters conditionally based on input
    if (member.name) {
      filters.push(where("name", "==", member.name));
    }
    if (member.dateOfBirth) {
      filters.push(where("dateOfBirth", "==", member.dateOfBirth));
    }
    if (member.phone) {
      filters.push(where("phone", "==", member.phone));
    }

    try {
      // Construct the query with all filters
      const q = query(collectionRef, ...filters);

      // Execute the query
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No matching documents.");
        setSearchMemberResult(null);
        return;
      }

      // Map the results
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchMemberResult(results as MemberSearchResults[]);
    } catch (error) {
      console.error("Error searching members:", error);
      throw new Error("Failed to fetch data.");
    }
  };

  const handleAddRide = async (selectedMember: MemberSearchResults) => {
    const birthMonth = new Date(selectedMember.dateOfBirth).getMonth();
    const currentMonth = new Date().getMonth();

    const memberRef = doc(db, "members", selectedMember.id);

    if (
      birthMonth == currentMonth &&
      selectedMember.birthdayFreeRidesUsed < selectedMember.maxBirthdayFreeRides
    ) {
      await addDoc(collection(db, "rides"), {
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        isBirthdayFreeRide: true,
        createdAt: new Date().toISOString(),
      });

      await updateDoc(memberRef, {
        birthdayFreeRidesUsed: selectedMember.birthdayFreeRidesUsed + 1,
      });

      alert("Berhasil memakai jatah ultah");
    }

    await addDoc(collection(db, "rides"), {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      isBirthdayFreeRide: false,
      createdAt: new Date().toISOString(),
    });

    await updateDoc(memberRef, {
      rideUsed: selectedMember.rideUsed + 1,
    });
    alert("Berhasil memakai jatah permainan");
  };

  const checkIsEligibleToRide = (member: MemberSearchResults) => {
    const isExpired =
      new Date(member.endDate).getTime() <= new Date().getTime();
    const isNoFreeRideAvailable =
      member.maxRides -
        member.rideUsed +
        (member.maxBirthdayFreeRides - member.birthdayFreeRidesUsed) ==
      0;

    return isExpired || isNoFreeRideAvailable;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Informasi Member</h2>
        <div>
          <label htmlFor="name">
            Nama:
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="phone">
            Nomor Handphone:
            <input
              type="tel"
              name="phone"
              value={member.phone}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="dateOfBirth">
            Tanggal Lahir:
            <input
              type="date"
              name="dateOfBirth"
              value={member.dateOfBirth}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="customMemberId">
            Custom Member ID:
            <input
              type="text"
              name="customMemberId"
              value={member.customMemberId}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <button type="submit">Cari</button>
      </form>
      <div>
        Result :{" "}
        {searchMemberResult?.map((res) => (
          <div key={res.id}>
            <p>Nama : {res.name}</p>
            <p>
              Sisa Jumlah Main :{" "}
              {res.maxRides -
                res.rideUsed +
                (res.maxBirthdayFreeRides - res.birthdayFreeRidesUsed)}{" "}
              dari {res.maxRides + res.maxBirthdayFreeRides}
            </p>
            <p>
              {" "}
              Aktif Sampai :{" "}
              {new Intl.DateTimeFormat("id-ID", {
                dateStyle: "full",
              }).format(new Date(res.endDate))}
            </p>
            <button
              disabled={checkIsEligibleToRide(res)}
              onClick={() => handleAddRide(res)}
            >
              Tambah Permainan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
