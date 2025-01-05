"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Member, MemberSearchResults } from "../types";
import { db } from "../../../../firebase";
import {
  QueryFieldFilterConstraint,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import isCurrentBirthdateMonth from "@/app/helpers/isCurrentBirthdayMonth";
import { useAuth } from "@/app/hooks/AuthProvider";
import withAuth from "@/app/hooks/withAuth";

type SearchMember = Omit<Member, "type">;
function SearchMembers() {
  const { user } = useAuth();
  const [member, setMember] = useState<SearchMember>({
    name: "",
    phone: "",
    dateOfBirth: "",
    customMemberId: "",
  });

  const [searchMemberResult, setSearchMemberResult] = useState<
    MemberSearchResults[] | null
  >(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    const collectionRef = collection(db, "members"); // Reference to the Firestore collection
    const filters: QueryFieldFilterConstraint[] = []; // Array to hold the filters

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
    setIsSubmitting(true);
    const memberRef = doc(db, "members", selectedMember.id);

    if (
      isCurrentBirthdateMonth(selectedMember.dateOfBirth) &&
      selectedMember.birthdayFreeRidesUsed < selectedMember.maxBirthdayFreeRides
    ) {
      await addDoc(collection(db, "rides"), {
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        isBirthdayFreeRide: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.email,
      });

      await updateDoc(memberRef, {
        birthdayFreeRidesUsed: selectedMember.birthdayFreeRidesUsed + 1,
      });

      alert("Berhasil memakai jatah ultah");
    } else {
      console.log("add rider", {
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        isBirthdayFreeRide: false,
        createdAt: new Date().toISOString(),
        createdBy: user?.email,
      });
      await addDoc(collection(db, "rides"), {
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        isBirthdayFreeRide: false,
        createdAt: new Date().toISOString(),
        createdBy: user?.email,
      });

      await updateDoc(memberRef, {
        rideUsed: selectedMember.rideUsed + 1,
      });
      alert("Berhasil memakai jatah permainan");
    }

    setIsSubmitting(false);
  };

  const checkIsEligibleToRide = (member: MemberSearchResults) => {
    const isExpired =
      new Date(member.endDate).getTime() <= new Date().getTime();

    const totalBirthdayFreeRidesUsed = isCurrentBirthdateMonth(
      member.dateOfBirth
    )
      ? member.maxBirthdayFreeRides - member.birthdayFreeRidesUsed
      : 0;

    const isNoFreeRideAvailable =
      member.maxRides - member.rideUsed + totalBirthdayFreeRidesUsed == 0;

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
            <p>Tanggal Lahir : {res.dateOfBirth}</p>
            <p>
              Sisa Sesi : {res.maxRides - res.rideUsed} dari {res.maxRides}
            </p>
            <p>
              Sisa Sesi Gratis Khusus Di Bulan Ulang Tahun:{" "}
              {res.maxBirthdayFreeRides - res.birthdayFreeRidesUsed} dari{" "}
              {res.maxBirthdayFreeRides}
            </p>
            <p>
              {" "}
              Aktif Sampai :{" "}
              {new Intl.DateTimeFormat("id-ID", {
                dateStyle: "full",
              }).format(new Date(res.endDate))}
            </p>
            <button
              disabled={checkIsEligibleToRide(res) || isSubmitting}
              onClick={() => handleAddRide(res)}
            >
              Tambah Sesi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(SearchMembers);
