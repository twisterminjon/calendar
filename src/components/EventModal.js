import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import {labelsCol,getColor} from '../dic/colDic'
import parse from "html-react-parser";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

export default function EventModal() {
  Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
  };
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
  } = useContext(GlobalContext);
  // console.log(selectedEvent)

  // const [title, setTitle] = useState(
  //   selectedEvent ? selectedEvent.title : ""
  // );
  // const [description, setDescription] = useState(
  //   selectedEvent ? selectedEvent.description : ""
  // );
  // console.log(labelsCol.find((lbl) => lbl.lab === selectedEvent.label).lab)
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsCol.find((lbl) => lbl.lab === selectedEvent.label)?.lab
      : labelsCol[0].lab
  );

  let {
    title,
    description,
    startDay,
    startTime,
    endDay,
    endTime,
    duration   
  } = selectedEvent
  startDay = new Date(startDay);
  endDay = endDay ? new Date(endDay) : null;

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }
  
  // startDay = startDay.toString()
  // console.log(startDay)
  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-1/2">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <>
                {/* <span
                  onClick={() => {
                    dispatchCalEvent({
                      type: "delete",
                      payload: selectedEvent,
                    });
                    // dispatchCalEvent({
                    //   type: "refresh",
                    // });
                    setShowEventModal(false);
                  }}
                  className="material-icons-outlined text-gray-400 cursor-pointer"
                >
                  delete
                </span> */}
                {/* <span
                  onClick={() => {
                    const storageEvents = localStorage.getItem("savedEvents");
                    const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
                    console.log(parsedEvents)
                    dispatchCalEvent({
                      type: "refresh",
                      payload: parsedEvents
                    });
                    setShowEventModal(false);
                  }}
                  className="material-icons-outlined text-gray-400 cursor-pointer"
                >
                  delete
                </span> */}
              </>
              
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-12 items-end gap-y-2">
            <div className={`bg-${getColor(selectedLabel)}-500 w-6 h-6 rounded-full`}/>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="col-span-11 pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              // onChange={(e) => setTitle(e.target.value)}
            />
            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            <p className="col-span-11">{startDay.customFormat( "#DDD#, #MMM# #DD#" )}</p>
            {endDay && (
            <>
              <span className="material-icons-outlined text-gray-400"> 
                schedule             
              </span>
              <p className="col-span-11">{endDay.customFormat( "#DDD#, #MMM# #DD#" )}</p>
            </>)}
            {duration && (
            <>
              <span className="material-icons-outlined text-gray-400"> 
                schedule             
              </span>
              <p className="col-span-11">{duration}</p>
            </>)}
            {/* <input
              type="text"
              name="duration"
              placeholder="Продолжительность"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />        */}
            {/* <p className="col-span-11">Duration</p> */}
            {/* <span>
            </span>  */}
            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <div className="col-span-11">
              <SunEditor defaultValue={description} hideToolbar={true} height="100%" />
            </div>
            {/* <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            {/* <div dangerouslySetInnerHTML={{ __html: description }} /> */}
            {/* <div>{description}</div> */}
            {/* <div className="test">{parse(description)}</div> */}
            {/* <div dangerouslySetInnerHTML={{ __html: "<a href='https://linuxize.com/post/how-to-list-files-in-linux-using-the-ls-command/'><code>ls</code> command</a>" }} /> */}
            {/* <span className="material-icons-outlined text-gray-400">
              bookmark_border
            </span>
            <div className="flex gap-x-2">
              {labelsColor.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className="material-icons-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </span>
              ))}
            </div> */}
            {/* <span>
            </span>
            <div className="grid grid-cols-1/3 items-end gap-y-1">
              {labelsText.map((lbl, i) => (
                <div className="flex">
                  <div
                  key={i}
                  onClick={() => setSelectedLabel(lbl)}
                  className={`bg-${labelsColor[i]}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                  >
                    {selectedLabel === lbl && (
                      <span className="material-icons-outlined text-white text-sm">
                        check
                      </span>
                    )}
                  </div>
                  <div className="ml-5">
                    {lbl}
                  </div>
                </div>
              ))}
            </div> */}
            {/* <span>
            </span>
            <div className="grid grid-cols-1/3 items-end gap-y-1">
              {labelsCol.map((lbl, i) => (
                <div className="flex">
                  <div
                  key={i}
                  onClick={() => setSelectedLabel(lbl.lab)}
                  className={`bg-${lbl.col}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                  >
                    {selectedLabel === lbl.lab && (
                      <span className="material-icons-outlined text-white text-sm">
                        check
                      </span>
                    )}
                  </div>
                  <div className="ml-5">
                    {lbl.lab}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
        {/* <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer> */}
      </form>
    </div>
  );
}
