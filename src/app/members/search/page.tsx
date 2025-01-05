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
import formatDate from "@/app/helpers/formatDate";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    setIsLoading(true);
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
        setIsLoading(false);
        return;
      }

      // Map the results
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchMemberResult(results as MemberSearchResults[]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error searching members:", error);
      throw new Error("Failed to fetch data.");
    }
  };

  const handleAddRide = async (
    selectedMember: MemberSearchResults,
    index: number
  ) => {
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

      if (searchMemberResult) {
        const newSearchMemberResult = searchMemberResult;
        newSearchMemberResult[index] = {
          ...newSearchMemberResult[index],
          birthdayFreeRidesUsed:
            newSearchMemberResult[index].birthdayFreeRidesUsed + 1,
        };
      }

      alert("Berhasil memakai jatah ultah");
    } else {
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

      if (searchMemberResult) {
        const newSearchMemberResult = searchMemberResult;
        newSearchMemberResult[index] = {
          ...newSearchMemberResult[index],
          rideUsed: newSearchMemberResult[index].rideUsed + 1,
        };
      }
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
    <div
      className="p-4 space-y-4"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="text-center text-xl/9 font-bold tracking-tight text-gray-900">
        Halaman Pencarian Member
      </h3>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={member.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
        />

        <input
          type="text"
          name="phone"
          placeholder="No. HP"
          value={member.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={member.dateOfBirth}
          onChange={handleInputChange}
          max="2024-12-31"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
        />

        <input
          type="text"
          name="customMemberId"
          placeholder="Member ID"
          value={member.customMemberId}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 w-full text-white bg-playdays-purple rounded-md hover:bg-playdays-purple"
          >
            Cari Member
          </button>
        </div>
      </form>

      <div className="py-4">
        <div className="flex flex-col gap-4">
          {isLoading && <p>Loading...</p>}
          {!isLoading && !searchMemberResult && (
            <>
              <h3 className="text-m/9 font-bold tracking-tight text-gray-900">
                Hasil Pencarian :
              </h3>
              <p>"Tidak ada data yang ditemukan"</p>
            </>
          )}
          {!isLoading && searchMemberResult && (
            <>
              <h3 className="text-m/9 font-bold tracking-tight text-gray-900">
                {` Hasil Pencarian (${searchMemberResult.length}) :`}
              </h3>
              {searchMemberResult?.map((result, index) => (
                <div
                  className="bg-purple-50 p-4 rounded-lg shadow-md"
                  key={result.id}
                >
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <div>
                    <div className="grid grid-cols-[1fr_10px_1fr]">
                      <p className="text-sm text-gray-600">Tanggal Lahir</p>
                      <p>:</p>
                      <p>{formatDate(result.dateOfBirth)}</p>
                    </div>

                    <div className="grid grid-cols-[1fr_10px_1fr]">
                      <p className="text-sm text-gray-600"> Sisa Sesi</p>
                      <p>:</p>
                      <p>
                        {result.maxRides - result.rideUsed}/{result.maxRides}
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_10px_1fr]">
                      <p className="text-sm text-gray-600"> Sisa Sesi Ultah</p>
                      <p>:</p>
                      <p>
                        {result.maxBirthdayFreeRides -
                          result.birthdayFreeRidesUsed}
                        /{result.maxBirthdayFreeRides}
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_10px_1fr]">
                      <p className="text-sm text-gray-600"> Masa Berlaku</p>
                      <p>:</p>
                      <p>{formatDate(result.endDate)}</p>
                    </div>
                  </div>
                  {!checkIsEligibleToRide(result) ? (
                    <button
                      className="px-4 py-2 my-2 w-full text-white bg-playdays-purple rounded-md hover:bg-playdays-purple"
                      disabled={checkIsEligibleToRide(result) || isSubmitting}
                      onClick={() => handleAddRide(result, index)}
                    >
                      Pakai Sesi
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 my-2 w-full text-gray-700 bg-gray-400 rounded-md hover:bg-gray-400"
                      disabled
                    >
                      Sesi tidak tersedia
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(SearchMembers);
