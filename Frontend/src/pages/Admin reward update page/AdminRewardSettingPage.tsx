// src/app/admin/rewards/settings/page.jsx
import { useState, useEffect, useRef } from "react";
import SettingsHeader from "@/layout/components/admin-page-component/reward-setting-component/SettingsHeader";
import SettingsTabs from "@/layout/components/admin-page-component/reward-setting-component/SettingsTabs";
import SummaryCards from "@/layout/components/admin-page-component/reward-setting-component/SummaryCards";
import ActionButtons from "@/layout/components/admin-page-component/reward-setting-component/ActionButtons";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { RewardSettings } from "@/types/interface.type";
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import equal from "fast-deep-equal";

const AdminRewardSettingPage = () => {
  const { systemSetting, fetchSystemSettingRewardPoint, isLoading, error } = useSystemSettingStore();
  const [settings, setSettings] = useState<RewardSettings>(systemSetting);
  const [isSaving, setIsSaving] = useState(false);
  const originalSettingRef = useRef(systemSetting);
  const { showToast } = useToast();
  console.log(systemSetting);

  // Initialize settings
  useEffect(() => {
    fetchSystemSettingRewardPoint();
  }, [fetchSystemSettingRewardPoint]);

  useEffect(() => {
    if (systemSetting) {
      setSettings(systemSetting);
      originalSettingRef.current = systemSetting;
    }
  }, [systemSetting]);

  // Handle setting changes
  const handleSettingChange = (key: string, value: number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle nested setting changes
  const handleNestedSettingChange = (
    parentKey: string,
    childKey: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof RewardSettings] as object),
        [childKey]: value,
      },
    }));
  };

  // Save settings to backend
  const handleSaveSettings = async () => {
    setIsSaving(true);
      try {
        if (equal(originalSettingRef.current, settings)) {
          showToast("info", "No changes to save.");
          return;
        }
        const response = await axiosInstance.put(
          "/api/systemSetting/reward-points",
          {
            settings,
          },
        );
        if (response?.data) {
          showToast("success", "update successfully");
          const latestData = response.data.newData[0].value;
          const clonedLatest = JSON.parse(JSON.stringify(latestData));
          setSettings(clonedLatest);
          originalSettingRef.current = clonedLatest;
          return;
        }
      } catch (error: any) {
        const messages =
          error?.response?.data?.error || error?.response?.data?.message;
        if (messages.includes("Access denied")) {
          showToast("warn", error?.response?.data?.message);
          return;
        }
        showToast("error", error.message);
      } finally {
        setIsSaving(false);
      }
  };

  // Reset to default settings
  const handleResetSettings = () => {
    fetchSystemSettingRewardPoint(); 
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading reward settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 bg-red-50 p-6 text-center">
        <div className="text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 19a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <h2 className="mt-2 text-xl font-semibold">Something went wrong</h2>
          <p className="mt-1 text-sm text-red-500">
            We couldn’t load the reward settings. Please try again later or
            contact support.
          </p>
        </div>
        <button
          onClick={fetchSystemSettingRewardPoint}
          className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <SettingsHeader />

      <SettingsTabs
        settings={settings}
        handleSettingChange={handleSettingChange}
        handleNestedSettingChange={handleNestedSettingChange}
      />

      <SummaryCards settings={settings} />

      <ActionButtons
        isSaving={isSaving}
        handleResetSettings={handleResetSettings}
        handleSaveSettings={handleSaveSettings}
      />
    </div>
  );
};

export default AdminRewardSettingPage;
