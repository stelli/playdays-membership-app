"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../../../../firebase"; // Import your Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import addNDaysAfter from "@/app/helpers/addNDaysAfter";
import { MEMBERSHIP_TYPE, Member, MembershipTypeEnum } from "../types";
import { useAuth } from "@/app/hooks/AuthProvider";
import withAuth from "@/app/hooks/withAuth";

const MembershipForm: React.FC = () => {
  const { user } = useAuth();
  const [member, setMember] = useState<Member>({
    name: "",
    phone: "",
    dateOfBirth: "",
    customMemberId: "",
    type: MembershipTypeEnum.ORANGE_SLIDE,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedMemberType = MEMBERSHIP_TYPE[member.type];
    const today = new Date();
    const membershipData = {
      ...member,
      startDate: today.toISOString(),
      endDate: addNDaysAfter({
        startDate: today,
        days: selectedMemberType.validForNDays,
      }),
      maxRides: selectedMemberType.maxRides,
      maxBirthdayFreeRides: selectedMemberType.birthdayFreeRides,
      rideUsed: 0,
      birthdayFreeRidesUsed: 0,
      createdBy: user?.email,
    };

    try {
      const memberRef = await addDoc(collection(db, "members"), membershipData);
      const memberId = memberRef.id;

      await addDoc(collection(db, "membershipHistory"), {
        memberId,
        startDate: membershipData.startDate,
        endDate: membershipData.endDate,
        type: membershipData.type,
      });

      alert("Membership added successfully!");
      setMember({
        name: "",
        phone: "",
        dateOfBirth: "",
        type: MembershipTypeEnum.ORANGE_SLIDE,
        customMemberId: "",
      });
    } catch (error) {
      console.error("Error adding membership: ", error);
      alert("Failed to add membership.");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="p-4 space-y-4"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h3 className="text-center text-xl/9 font-bold tracking-tight text-gray-900">
        Halaman Registrasi Member
      </h3>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <label>
          <p> Nama :</p>
          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={member.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
          />
        </label>

        <label>
          <p>No. Hp :</p>
          <input
            type="text"
            name="phone"
            placeholder="No. HP"
            value={member.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
          />
        </label>

        <label>
          <p>Tanggal Lahir : </p>
          <input
            type="date"
            name="dateOfBirth"
            value={member.dateOfBirth}
            onChange={handleInputChange}
            max="2024-12-31"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
          />
        </label>

        <label>
          <p>Custom Member ID: </p>
          <input
            type="text"
            name="customMemberId"
            placeholder="Member ID"
            value={member.customMemberId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
          />
        </label>

        <label htmlFor="type">
          <p>Jenis Member</p>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-playdays-purple"
            name="type"
            onChange={handleInputChange}
          >
            {Object.values(MEMBERSHIP_TYPE)?.map((memberType) => (
              <option key={memberType.label}>{memberType.label}</option>
            ))}
          </select>
        </label>

        <div className="flex justify-between">
          <button
            disabled={isSubmitting}
            type="submit"
            className="px-4 py-2 w-full text-white bg-playdays-purple rounded-md hover:bg-playdays-purple"
          >
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(MembershipForm);
