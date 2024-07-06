import {Text, View} from "react-native";
import {makeTime} from "wlb-intelligence/data/time";

export default function Index() {
  const now = makeTime();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>WLB: {now.formatted}</Text>
    </View>
  );
}
