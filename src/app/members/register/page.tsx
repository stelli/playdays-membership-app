"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { db } from "../../../../firebaseConfig"; // Import your Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import addNDaysAfter from "@/app/helpers/addNDaysAfter";
import { MEMBERSHIP_TYPE, Member, MembershipTypeEnum } from "../types";

const MembershipForm: React.FC = () => {
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
    <form onSubmit={handleSubmit}>
      <h2>Member Information</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={member.phone}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dateOfBirth"
            value={member.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Custom Member ID:
          <input
            type="text"
            name="customMemberId"
            value={member.customMemberId}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label htmlFor="type">
          Tipe member
          <select name="type" onChange={handleInputChange}>
            {Object.values(MEMBERSHIP_TYPE)?.map((memberType) => (
              <option key={memberType.label}>{memberType.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        Add Membership
      </button>
    </form>
  );
};

export default MembershipForm;
