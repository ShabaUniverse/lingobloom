import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { roomName } = useParams(); // Получаем roomName из URL

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: roomName, // Используем переданный идентификатор комнаты
      width: "100%",
      height: "100%",
      parentNode: document.getElementById("jitsi-container"),
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);

    // Очищаем ресурс при закрытии компонента
    return () => api.dispose();
  }, [roomName]);

  return (
    <div className="video-call-container w-full h-screen">
      <div id="jitsi-container" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default VideoCall;
