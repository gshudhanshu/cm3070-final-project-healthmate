"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/messages/side-bar";
import MessageThread from "@/components/messages/main-thread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMessagesStore } from "@/store/useMessageStore";
import { useMedicalRecordsStore } from "@/store/useMedicalRecordStore";

import MedicalRecordPage from "@/app/dashboard/medical-records/page";
import AddNewRecord from "@/components/medical-records/add-new-record";

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
          <MessageThread className="w-full pb-10 pr-6" />
        )
      ) : (
        <>
          <Sidebar className="flex-shrink px-6 pb-6" />
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="mt-6">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
              <TabsTrigger value="add-new-medical-record">
                Add New Record
              </TabsTrigger>
            </TabsList>
            <TabsContent value="messages">
              <MessageThread className="pb-10 pr-6" />
            </TabsContent>
            <TabsContent value="medical-records">
              <MedicalRecordPage isDoctorFetching={true} />
            </TabsContent>
            <TabsContent value="add-new-medical-record">
              <AddNewRecord />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default MessagesPage;
