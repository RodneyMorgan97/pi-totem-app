// ConnectionStatus.tsx
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  if (isConnected) {
    return (
      <MaterialCommunityIcons name="wifi-strength-4" size={24} color="green" />
    );
  } else {
    return (
      <MaterialCommunityIcons
        name="wifi-strength-alert-outline"
        size={24}
        color="red"
      />
    );
  }
};

export default ConnectionStatus;
