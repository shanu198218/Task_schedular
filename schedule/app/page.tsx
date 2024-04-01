"use client";
import { Button } from "@/components/button";
import { addMonths, getISOWeek, getISOWeeksInYear, subMonths } from "date-fns";
import React from "react";
import { useState } from "react";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = (year: number, month: number) => {
    const numDays = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const data = [];

    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (day > numDays) {
          break;
        } else {
          week.push(new Date(year, month, day));
          day++;
        }
      }
      data.push(week);
    }

    return data;
  };

  const handleClick = (day: Date) => {
    setSelectedDate(day);
    toggleMenu();

    const dayElement = document.getElementById(`day-${day.getDate()}`);
    if (dayElement) {
      dayElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setSelectedDate(new Date(selectedDate.getFullYear(), newMonth, 1));
  };

  const handleWeekAndYearChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const [year, week] = selectedValue.split("-").map(Number);
    const date = new Date();
    date.setFullYear(year, 0, 1);
    date.setDate((week - 1) * 7 + 1);
    setSelectedDate(date);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };
  

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const renderDay = (day: Date | null) => {
    if (!day) {
      return <div className="day"></div>;
    }

    const classNames = [
      "day",
      "cursor-pointer",
      day.getMonth() !== selectedDate.getMonth() ? "text-gray-500" : "",
      day.getDate() === selectedDate.getDate() &&
      day.getMonth() === selectedDate.getMonth()
        ? " bg-aquamarine-700 rounded-md  text-white "
        : "",
    ].join(" ");

    return (
      <div
        id={`day-${day.getDate()}`}
        className={classNames}
        onClick={() => handleClick(day)}
      >
        {day.getDate()}
      </div>
    );
  };

  const monthData = getMonthData(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

 
  return (
    <div className="w-full my-8 p-4">
     
      <div className="float-right flex gap-2 ">
        <Button
          className="border border-gray-300 dark:bg-[#3b3b3b] dark:text-white focus:border-black text-gray-600 rounded-md py-5 bg-white hover:bg-zinc-100"
          onClick={handleTodayClick}
        >
          Today
        </Button>

        <select
          className="r-2 border-2 rounded-md p-2 text-base focus:border-black"
          value={selectedDate.getMonth()}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i} className="py-0">
              {new Date(0, i).toLocaleDateString("en-US", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="mr-2 border-2 rounded-md p-2 focus:border-black"
          value={`${selectedDate.getFullYear()}-${getISOWeek(selectedDate)}`}
          onChange={handleWeekAndYearChange}
        >
          {Array.from(
            { length: getISOWeeksInYear(selectedDate.getFullYear()) },
            (_, i) => (
              <option key={i} value={`${selectedDate.getFullYear()}-${i + 1}`}>
                {`Week ${i + 1} of ${selectedDate.getFullYear()}`}
              </option>
            )
          )}
        </select>

        <Button
          className="hover:bg-zinc-100 focus:border-black bg-white dark:bg-[#3b3b3b] dark:text-white border border-gray-300 hover:dark:bg-zinc-900 text-md text-gray-600 py-5  "
          onClick={toggleMenu}
          variant={"default"}
        >
          <SlCalender className="text-lg mr-2" /> Calender
        </Button>

        {isOpen && (
          <div className="absolute z-10 right-9 mt-2 bg-white dark:bg-black p-4 rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
            <Button variant={"link"} className="hover:no-underline" onClick={handlePrevMonth}><MdKeyboardArrowLeft /></Button>
              <h1 className="text-lg font-bold">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
              <Button variant={"link"} className="hover:no-underline" onClick={handleNextMonth}><MdOutlineKeyboardArrowRight /></Button>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm text-gray-500 dark:text-white">
                  {day}
                </div>
              ))}
              {monthData.map((week, idx) => (
                <React.Fragment key={idx}>
                  {week.map((day, index) => (
                    <div key={index} className="text-center">
                      {renderDay(day)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full min-h-screen">
        <div className="my-16 shadow-inner w-full">
          <div className="grid grid-cols-6 border-t-2 ">
            <div className="border-x-2  col-span-1 row-span-5"></div>
            <div className=" col-span-5 bg-[#00b297]  ">
              <h1 className="text-lg text-center font-bold ">
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
            </div>

            <div className="border-y-2 col-span-5 ">
              <div className=" col-span-5">
                <div className="overflow-x-auto">
                  <div className="flex  pl-2">
                    {monthData
                      .flat()
                      .filter((day): day is Date => day !== null)
                      .map((day, index) => (
                        <div
                          key={index}
                          className={`text-center text-sm border-r-2 border-gray-300 pl-4 p-1 ${
                            day.getDay() === 0 || day.getDay() === 6
                              ? "bg-green-300/70 "
                              : ""
                          }`}
                        >
                          <>
                            <div className="text-center text-sm text-gray-500">
                              {day
                                .toLocaleDateString("en-US", {
                                  weekday: "long",
                                })
                                .slice(0, 3)}{" "}
                            </div>
                            <div
                              className={`${
                                day.getMonth() === selectedDate.getMonth() &&
                                day.getDate() === selectedDate.getDate()
                                  ? "bg-aquamarine-700 text-white"
                                  : ""
                              } rounded-md p-1`}
                              onClick={() => handleClick(day)}
                            >
                              {day.getDate()}
                            </div>
                          </>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6  ">
            <div className="col-span-1 border-2 shadow-md flex flex-col justify-center items-center ">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-5 mt-5 ">
                  <div className="mb-4 pl-2 text-center">test {index + 1}</div>{" "}
                </div>
              ))}
            </div>

            <div className=" col-span-5 row-span-5 border-2 flex flex-col justify-start items-start">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-5 mt-5">
                  <div className="mb-4 pl-2">test {index + 1}</div>{" "}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
