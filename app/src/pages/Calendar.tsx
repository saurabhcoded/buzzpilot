import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { getPostsList } from "../api/resources";
import { useAuth } from "../hooks/useAuth";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const getEventsFromPosts = (postsList) => {
    let eventsList = [];
    if (Array.isArray(postsList)) {
      postsList.forEach((post) => {
        let isPublished = post?.isPublished;
        let isScheduled = post?.isScheduled;
        if (isPublished) {
          eventsList.push({
            id: post?.id,
            title: post?.title,
            start: new Date(post?.publishTime).toISOString().split("T")[0],
            extendedProps: {
              calendar: "Success",
              description: post?.description,
            },
          });
        } else if (isScheduled) {
          eventsList.push({
            id: post?.id,
            title: post?.title,
            start: new Date(post?.scheduleTime).toISOString().split("T")[0],
            extendedProps: {
              calendar: "Primary",
              description: post?.description,
            },
          });
        } else {
          eventsList.push({
            id: post?.id,
            title: post?.title,
            start: new Date(post?.createdAt).toISOString().split("T")[0],
            extendedProps: {
              calendar: "Danger",
              description: post?.description,
            },
          });
        }
      });
    }
    return eventsList;
  };
  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getPostsList(user?.uid)
        .then((response) => {
          if (Array.isArray(response)) {
            let events = getEventsFromPosts(response);
            setEvents(events);
          }
          setIsLoading(false);
        })
        .catch((Err) => {
          console.error(Err);
          setIsLoading(false);
        });
    }
  }, [user?.uid]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta title="Buzzpilot Calendar Dashboard" description="" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            // customButtons={{
            //   addEventButton: {
            //     text: "Add Event +",
            //     click: openModal,
            //   },
            // }}
          />
        </div>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      title={eventInfo.event?.title}
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded cursor-pointer`}
    >
      <div className="fc-daygrid-event-dot"></div>
      {/* <div className="fc-event-time">{eventInfo.start}</div> */}
      <div className="fc-event-title">{eventInfo.event?.title}</div>
    </div>
  );
};

export default Calendar;
