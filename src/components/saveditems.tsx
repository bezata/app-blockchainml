"use client";

import React from "react";
import { NavBar } from "./component/nav-bar"; // Importing NavBar component
import { SavedDatasetsComponent } from "./saved-datasets";
const username: string = "yourUsername";
const SavedItems = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800 font-sans">
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
        <NavBar />
      </header>
      <main className="fle-grow overflow-y-auto">
        <div className="p-3 flex items-center space-x-2">
          <p className="font-bold text-black">{username}&apos;s Saved items</p>
          <button className="p-1 text-sm border rounded-md bg-white border-gray-200 hover:shadow-md transition-all duration-300">
            + New
          </button>
        </div>
        <SavedDatasetsComponent />
      </main>
    </div>
  );
};

export default SavedItems;
