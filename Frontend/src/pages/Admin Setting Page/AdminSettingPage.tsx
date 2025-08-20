// src/pages/AdminSettingPage.jsx
import { useState, useEffect } from "react";
import {
  Key,
  FileText,
  Hotel,
  Download,
  X,
  Sliders,
  UserCog2,
} from "lucide-react";
import AdminPortalAccessSettingTab from "@/layout/components/admin-page-component/setting-component/AdminPortalAccessSettingTab";
import HotelInformationSetting from "@/layout/components/admin-page-component/setting-component/HotelInformationSetting";
import ReportGeneratorSetting from "@/layout/components/admin-page-component/setting-component/ReportGeneratorSetting";
import UserActivityTrackSetting from "@/layout/components/admin-page-component/setting-component/UserActivityTrackSetting";
import axiosInstance from "@/lib/axios";

const AdminSettingPage = () => {
  // status manage
  const [adminCode, setAdminCode] = useState("");
  const [newAdminCode, setNewAdminCode] = useState("");
  const [confirmAdminCode, setConfirmAdminCode] = useState("");
  const [reportType, setReportType] = useState("daily");
  const [reportDate, setReportDate] = useState("");
  const [hotelInfo, setHotelInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    checkInTime: "",
    checkOutTime: "",
  });
  const [activeTab, setActiveTab] = useState("access");
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUpdateAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newAdminCode === "" || confirmAdminCode === "") {
      return;
    }
    if (newAdminCode !== confirmAdminCode) {
      setErrorMessage("New access code and confirmation do not match.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/systemSetting/change-otp",
        {
          newOTP: newAdminCode,
        },
      );

      if (response?.data?.message) {
        setIsSaved(true);
        setSuccessMessage(response.data.message);
        setAdminCode(response?.data?.updatedOTP.otpCode);
        setNewAdminCode("");
        setConfirmAdminCode("");
        setTimeout(() => {
          setIsSaved(false);
          setSuccessMessage("");
          setErrorMessage("");
        }, 3000);
      }
    } catch (error: any) {
      const messgae =
        error?.response?.data?.message || "Failed to update access code.";
      setErrorMessage(messgae);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

    useEffect(() => {
      const fetchAdminAccessCode = async () => {
        try {
          const response = await axiosInstance.get(
            "/api/systemSetting/get-admin-access-otp",
          );
          if (response?.data?.success === true) {
            setAdminCode(response.data.accessCode);
          }
        } catch (error: any) {
          console.log(
            "Error fetching admin access code:",
            error?.response?.data?.message ||
              "Failed to fetch admin access code.",
          );
        }
      };
      fetchAdminAccessCode();
    }, []);
    

  // 处理报表生成
  const handleGenerateReport = () => {
    setShowModal(true);
    // 实际应用中这里会调用API生成报表
  };

  // update hotel information without saving system setting
  const handleHotelInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setHotelInfo((prev) => ({ ...prev, [name]: value }));
  };

  // save all settings
  const saveAllSettings = async () => {
    try {
      const response = await axiosInstance.patch("/api/systemSetting/save-all-settings", {
        settings: {
          ...hotelInfo
        },
        key: "Hotel Information"
      });
      if(response?.data?.success){
        setIsSaved(true);
        if(response.data.updatedSettings.value){
          setHotelInfo(response.data.updatedSettings.value);
        }
        setSuccessMessage(response.data.message || "Setings saved successfully!");
        setTimeout(() => {
          setIsSaved(false);
          setSuccessMessage("");
          setErrorMessage("");
        }, 3000);
      }
    } catch (error: any) {
      console.log('Error in saveAllSettings: ', error?.response?.data?.error || "Failed to save settings.");
      setErrorMessage(error?.response?.data?.error || "Failed to save settings.");
      setIsSaved(false);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    const fetchHotelInformation = async () => {
      axiosInstance
        .get("/api/systemSetting/get-hotel-information")
        .then((response) => {
          console.log("hotel information: ", response.data);
          setHotelInfo(response.data.hotelInformation)
        })
        .catch((error: any) => {
          setErrorMessage(error?.response?.data?.error || "Failed to fetch hotel information.");
          setTimeout(() => setErrorMessage(""), 3000);
        });
    };
    fetchHotelInformation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <div className="flex items-center mb-2">
              <div className=" mr-2 bg-blue-200 rounded-2xl p-2 border-1 border-blue-300">
                <Sliders className="mx-auto text-blue-600" size={32} />
              </div>
              <h1 className="flex items-center text-3xl font-bold text-gray-800">
                System Settings
              </h1>
            </div>
            <p className="mt-1 text-gray-600">Administrator Settings</p>
          </div>
        </div>

        {/* Save Successfully message */}
        {isSaved && (
          <div className="mb-6 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            {successMessage || "Settings saved successfully!"}
          </div>
        )}

        {(errorMessage && !isSaved) && (
          <div className="mb-6 rounded-lg border border-rose-400 bg-rose-100 px-4 py-3 text-rose-700">
            {errorMessage || "Opps! Something went wrong."}
          </div>
        )}

        {/* tab option */}
        <div className="mb-6 flex flex-wrap border-b border-gray-200">
          {[
            { id: "access", label: "Access Code", icon: Key },
            { id: "reports", label: "Reports", icon: FileText },
            { id: "hotel", label: "Hotel Info", icon: Hotel },
            { id: "activity", label: "Activity", icon: UserCog2 },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`mr-2 mb-2 flex items-center rounded-t-lg px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2" size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* admin access code */}
        {activeTab === "access" && (
          <AdminPortalAccessSettingTab
            handleUpdateAccessCode={handleUpdateAccessCode}
            adminCode={adminCode}
            newAdminCode={newAdminCode}
            confirmAdminCode={confirmAdminCode}
            setNewAdminCode={setNewAdminCode}
            setConfirmAdminCode={setConfirmAdminCode}
          />
        )}

        {/* report generate */}
        {activeTab === "reports" && (
          <ReportGeneratorSetting
            reportType={reportType}
            setReportType={setReportType}
            reportDate={reportDate}
            setReportDate={setReportDate}
            handleGenerateReport={handleGenerateReport}
          />
        )}

        {/* hotel information setting */}
        {activeTab === "hotel" && (
          <HotelInformationSetting
            hotelInfo={hotelInfo}
            handleHotelInfoChange={handleHotelInfoChange}
            saveAllSettings={saveAllSettings}
          />
        )}

        {/* user tracking */}
        {activeTab === "activity" && <UserActivityTrackSetting />}
      </div>

      {/* Report generation modal box */}
      {showModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Report Generated
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 text-center">
                <FileText className="mx-auto mb-4 text-blue-500" size={48} />
                <p className="mb-2 text-gray-700">
                  Your{" "}
                  <span className="font-semibold">
                    {reportType.replace(/([A-Z])/g, " $1")}
                  </span>{" "}
                  report has been successfully generated.
                </p>
                <p className="text-sm text-gray-600">
                  Ready for download and analysis.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  className="flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  View Later
                </button>
                <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <Download className="mr-2" size={18} />
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingPage;
