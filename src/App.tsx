import React, { useState } from "react";
import ProfileSaver from "./components/ProfileSaver";
import AutoScroll from "./components/AutoScroll";
import LinkNavigator from "./components/LinkNavigator";
import SkoolSidekick from "./components/SkoolSidekick";
import OpenResponseGenerator from "./components/OpenResponseGenerator";
import SmartLinkSaver from "./components/SmartLinkSaver";

const App = () => {
  const [activeComponent, setActiveComponent] = useState("ProfileSaver");

  const renderComponent = () => {
    switch (activeComponent) {
      case "ProfileSaver":
        return <ProfileSaver />;
      case "AutoScroll":
        return <AutoScroll />;
      case "LinkNavigator":
        return <LinkNavigator />;
      case "SkoolSidekick":
        return <SkoolSidekick />;
      case "OpenResponseGenerator":
        return <OpenResponseGenerator />;
      case "SmartLinkSaver":
        return <SmartLinkSaver />;
      default:
        return <ProfileSaver />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-around">
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "ProfileSaver" ? "bg-blue-500" : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("ProfileSaver")}
        >
          Profile Saver
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "AutoScroll" ? "bg-blue-500" : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("AutoScroll")}
        >
          AutoScroll
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "LinkNavigator" ? "bg-blue-500" : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("LinkNavigator")}
        >
          Link Navigator
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "SkoolSidekick" ? "bg-blue-500" : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("SkoolSidekick")}
        >
          Skool Sidekick
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "OpenResponseGenerator"
              ? "bg-blue-500"
              : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("OpenResponseGenerator")}
        >
          Open Response Generator
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeComponent === "SmartLinkSaver"
              ? "bg-blue-500"
              : "bg-gray-700"
          } hover:bg-blue-400`}
          onClick={() => setActiveComponent("SmartLinkSaver")}
        >
          Smart Link Saver
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">{renderComponent()}</div>
    </div>
  );
};

export default App;
