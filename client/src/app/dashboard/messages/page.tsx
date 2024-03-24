"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/messages/side-bar";
import MessageThread from "@/components/messages/main-thread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMessagesStore } from "@/store/useMessageStore";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";
import { useAuthStore } from "@/store/useAuthStore";

import MedicalRecordPage from "@/app/dashboard/medical-records/page";
import AddNewRecord from "@/components/medical-records/add-new-record";
import AddNewReview from "@/components/medical-records/add-new-review";

function TabComponent({ isMobile }: { isMobile: boolean }) {
  const { user } = useAuthStore();
  return (
    <Tabs defaultValue="messages" className="w-full ">
      <TabsList className="mt-6">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
        {user?.account_type === "doctor" && (
          <TabsTrigger value="add-new-medical-record">
            Add New Record
          </TabsTrigger>
        )}
        {user?.account_type === "patient" && (
          <TabsTrigger value="add-new-review">Add New Review</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="messages">
        {isMobile && <MessageThread className="w-full pb-10 pr-6" />}
        {!isMobile && <MessageThread className="pb-10 pr-6" />}
      </TabsContent>
      <TabsContent value="medical-records">
        <MedicalRecordPage isDoctorFetching={true} />
      </TabsContent>
      <TabsContent value="add-new-medical-record">
        <AddNewRecord />
      </TabsContent>
      <TabsContent value="add-new-review">
        <AddNewReview />
      </TabsContent>
    </Tabs>
  );
}

const MessagesPage: React.FC = () => {
  const { isSidebarVisible, toggleSidebar } = useMessagesStore();
  const size = useWindowSize();
  const isMobile = size?.width && size.width < 768;

  const { selectedConversation } = useMessagesStore();

  return (
    <div className="container flex w-full gap-6 px-0">
      {isMobile ? (
        isSidebarVisible ? (
          <Sidebar className="w-full px-6 pb-6" />
        ) : (
          <TabComponent isMobile />
        )
      ) : (
        <>
          <Sidebar className="flex-shrink px-6 pb-6" />
          <TabComponent isMobile />
        </>
      )}
    </div>
  );
};

export default MessagesPage;
