// src/components/rewards/ActionButtons.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

interface ActionButtonsProps {
  isSaving: boolean;
  handleResetSettings: () => void;
  handleSaveSettings: () => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isSaving, 
  handleResetSettings, 
  handleSaveSettings 
}) => (
  <div className="mt-6 flex justify-end space-x-4">
    <Button
      variant="outline"
      onClick={handleResetSettings}
      disabled={isSaving}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Reset to Default
    </Button>
    <Button onClick={handleSaveSettings} disabled={isSaving}>
      {isSaving ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </>
      )}
    </Button>
  </div>
);

export default ActionButtons;