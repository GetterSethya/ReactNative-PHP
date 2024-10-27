import { Slot, useRouter } from "expo-router";
import * as secureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AuthLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await secureStore.getItemAsync("accessToken");
      if (accessToken) {
        router.replace("/(protected)/");
      } else {
        setIsLoading(false);
      }
    };

    checkAccessToken();
  }, []);

  if (isLoading) {
    return null; // Optionally, add a loading spinner here
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
