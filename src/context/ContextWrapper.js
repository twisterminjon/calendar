import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import axios from 'axios';

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) =>
        evt.id === payload.id ? payload : evt
      );
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  let data = []
  let convertData = []
  let convertData1 = []
  axios.get(`https://api.garazh.corpberry.com/calendar/event/?get-only-data`)
  .then(res => {
    data = res.data;

    console.log(data,"DATA")
    data.forEach((element,ind) => {
      // console.log(element.start?.substring(0,element.start?.indexOf(' ')))
      const id = element.id
      const start = Date.parse(element.start?.substring(0,element.start?.indexOf(' ')));
      const labelName = element.label.name
      if(element.end) { 
        const end  = Date.parse(element.end?.substring(0,element.end?.indexOf(' ')));

        const difference = Math.abs(end-start);
        const days = difference/(1000 * 3600 * 24) + 1

        console.log(days,ind)
        if(days === 1) {
          convertData.push({...element,"day":start})
        }
        else {
          for(let i = 0;i<days;i++) {
            convertData.push({...element,"day":start + 1000 * 3600 * 24 * i,"id":id+i})
          }
        }
      }
      else
      {
        convertData.push({...element,"day":start})
      }
    });
    convertData1 = convertData.map((el) => {
      const start = el.start
      const end = el.end
      const labelName = el.label.name
      return {...el,
        "startDay":Date.parse(start?.substring(0,start?.indexOf(' '))),
        "startTime":start?.substring(start?.indexOf(' ')+1,start?.length),
        "endDay":end ? Date.parse(end?.substring(0,end?.indexOf(' '))) : null,
        "endTime":end ? end?.substring(end?.indexOf(' ')+1,end?.length) : null,
        "label":labelName,
        "title":"temp title"
      }
    })
  })
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  // return convertData1
  console.log(parsedEvents,"OLDDATA");
  console.log(convertData1,"NEWDATA")
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );
  

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  // useEffect(() => {
  //   localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  // }, [savedEvents]);

  useEffect(() => {
    let data = []
    let convertData = []
    let convertData1 = []
    axios.get(`https://api.garazh.corpberry.com/calendar/event/?get-only-data`)
    .then(res => {
      data = res.data;
  
      console.log(data,"DATA")
      data.forEach((element,ind) => {
        // console.log(element.start?.substring(0,element.start?.indexOf(' ')))
        const id = element.id
        const start = Date.parse(element.start?.substring(0,element.start?.indexOf(' ')));
        const labelName = element.label.name
        if(element.end) { 
          const end  = Date.parse(element.end?.substring(0,element.end?.indexOf(' ')));
  
          const difference = Math.abs(end-start);
          const days = difference/(1000 * 3600 * 24) + 1
  
          console.log(days,ind)
          if(days === 1) {
            convertData.push({...element,"day":start})
          }
          else {
            for(let i = 0;i<days;i++) {
              convertData.push({...element,"day":start + 1000 * 3600 * 24 * i,"id":id+i})
            }
          }
        }
        else
        {
          convertData.push({...element,"day":start})
        }
      });
      convertData1 = convertData.map((el) => {
        const start = el.start
        const end = el.end
        const labelName = el.label.name
        const name = el.name
        return {...el,
          "startDay":Date.parse(start?.substring(0,start?.indexOf(' '))),
          "startTime":start?.substring(start?.indexOf(' ')+1,start?.length),
          "endDay":end ? Date.parse(end?.substring(0,end?.indexOf(' '))) : null,
          "endTime":end ? end?.substring(end?.indexOf(' ')+1,end?.length) : null,
          "label":labelName,
          "title":name
        }
      })
      console.log("DISPATCH")
      localStorage.setItem("savedEvents", JSON.stringify(convertData1));
    })
  }, []);  

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map(
        (label) => {
          const currentLabel = prevLabels.find(
            (lbl) => lbl.label === label
          );
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        }
      );
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(
      labels.map((lbl) => (lbl.label === label.label ? label : lbl))
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
