import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput } from "react-native";

const API = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

export default function App() {
  const [type, setType] = useState<"order" | "quote">("order");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  async function track() {
    const path = type === "order" ? `/track/order/${code}` : `/track/quote/${code}`;
    const r = await fetch(`${API}${path}`);
    setResult(JSON.stringify(await r.json(), null, 2));
  }

  return (
    <SafeAreaView style={{ padding: 24, gap: 12 }}>
      <Text>SASA Forge Tracking</Text>
      <Button title={`Mode: ${type}`} onPress={() => setType(type === "order" ? "quote" : "order")} />
      <TextInput value={code} onChangeText={setCode} placeholder="Public code" style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Track" onPress={track} />
      <Text>{result}</Text>
    </SafeAreaView>
  );
}
