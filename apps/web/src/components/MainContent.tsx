"use client";

import React from "react";


export default function MainContent() {
  return (
    <div className="absolute top-12 left-64 bottom-0 w-1/3 bg-white bg-opacity-90 border-r border-gray-200 overflow-y-auto p-4 z-50">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <input
          type="text"
          placeholder="Search your transactions"
          className="border p-2 rounded w-full"
        />
        <select className="border p-2 rounded flex-1"><option>Transaction Type</option></select>
        <select className="border p-2 rounded flex-1"><option>Reference Number</option></select>
        <select className="border p-2 rounded flex-1"><option>Contact</option></select>
        <select className="border p-2 rounded flex-1"><option>Amount</option></select>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">More Filters</button>
      </div>

      {/* Customer list */}
      <div className="space-y-4">
        <div className="bg-white border rounded shadow-sm p-3">
          <h3 className="font-semibold">Customer: Google</h3>
          <p className="text-xs text-gray-500">Campus Bayview • Building A100</p>
          <button className="bg-blue-500 text-white px-2 py-1 mt-2 rounded">Show Details</button>
        </div>
        <div className="bg-white border rounded shadow-sm p-3">
          <h3 className="font-semibold">Customer: Pinterest</h3>
          <p className="text-xs text-gray-500">Campus Mountain View • Building D315</p>
          <button className="bg-blue-500 text-white px-2 py-1 mt-2 rounded">Show Details</button>
        </div>
        <div className="bg-white border rounded shadow-sm p-3">
          <h3 className="font-semibold">Customer: Figma</h3>
          <p className="text-xs text-gray-500">Campus City • Building B212</p>
          <button className="bg-blue-500 text-white px-2 py-1 mt-2 rounded">Show Details</button>
        </div>
      </div>
    </div>
  );
}


