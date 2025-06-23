"use client";

import React from "react";


export default function MainContent() {
  return (
    <div className="sapce-y-4">
        <div className="flex items-center justify-between text-gray-800 ml-1 mt-1 bg-white bg-opacity-90 border-r border-gray-200 px-3 py-2 z-50">
            <div>
                <div className="text-xl font-semibold">All Customers</div>
                <div>12 customers, 8,901 filter units</div>
            </div>
            <div>
                <div>Search your transactions</div>
                <div className="flex items-center gap-4">
                    <div>
                        <div>Date range</div>
                        <div>calendar</div>
                    </div>
                    <div>
                        <div>Transaction Type</div>
                        <div>Select Transaction</div>
                    </div>
                    <div>
                        <div>Reference Number</div>
                        <div>Number</div>
                    </div>
                    <div>
                        <div>Contact</div>
                        <div>Select Contact</div>
                    </div>
                    <div>
                        <div>Amount</div>
                        <div>Select Amount</div>
                    </div>
                    <div>
                        <div>Memo</div>
                        <div>Select Memo</div>
                    </div>
                    <div>
                        <div>More Filters</div>
                        <div>More Filters</div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-[#FDF2F2] rounded-lg p-4 text-[#E85151]">
                    <div className="bg-[#FDE9E9] rounded-full p-2 flex justify-center"><span>5</span></div>
                    <div>CRITICAL</div>
                </div>
                <div className="bg-[#FDFDEB] rounded-lg p-4 text-[#A96718]">
                    <div className="bg-[#FDF6B4] rounded-full p-2 flex justify-center"><span>5</span></div>
                    <div>CRITICAL</div>
                </div>
            </div>
        </div>
    </div>

  );
}


