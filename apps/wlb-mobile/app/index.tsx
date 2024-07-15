import {StyleSheet, Text, TextInput} from "react-native";
import {makeTime} from "wlb-intelligence/data/time";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState} from "react";
import {parseWorkPeriodsSpec} from "wlb-intelligence/parsing/workPeriod";
import {WorkPeriod} from "wlb-intelligence/data/workPeriod";
import {enrichWorkPeriods} from "wlb-intelligence/intelligence/workday";
import {WorkdaySettings} from "wlb-intelligence/data/workdaySettings";
import {Duration} from "wlb-intelligence/data/duration";

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'Merriweather_700Bold',
    fontSize: 70,
  },
  input: {
    fontFamily: 'Merriweather_400Regular',
    fontSize: 30,
    borderColor: '#333',
    padding: 3,
    borderWidth: 0.5,
    minHeight: 150,
    textAlignVertical: "top"
  },
});

const workdaySettings = new WorkdaySettings(new Duration(8 * 60), new Duration(60));

export default function Index() {
  const now = makeTime();
  const [workPeriodsSpec, onChangeWorkPeriodsSpec] = useState(`9:00 - ${now.formatted}`);
  const onChange = (text: string) => {
    onChangeWorkPeriodsSpec(text)
  };

  const lines = parseWorkPeriodsSpec(workPeriodsSpec, now);
  const periods = lines.flatMap(line => {
    return line.success && line.begin && line.end ?
      [new WorkPeriod(line.begin, line.end, false, line.assumedEnd)]
      : [];
  });
  const enriched = enrichWorkPeriods(periods, workdaySettings, now);

  const textRes = new Array<string>();
  textRes.push(`Now: ${now.formatted}`);
  textRes.push(`Elapsed: ${enriched.elapsed.formatted}`);
  textRes.push(`Remaining: ${enriched.remaining.formatted}`);
  textRes.push(`Breaks: ${enriched.breaks.formatted}`);
  textRes.push("Periods:");
  for (const period of enriched.periods) {
    textRes.push(period.formatted);
  }

  return (
    <SafeAreaView style={{padding: 10}}>
      <Text style={styles.logo}>WLB</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        value={workPeriodsSpec}
        autoComplete={"off"}
        onChangeText={onChange}
      ></TextInput>
      <Text>{textRes.join("\n")}</Text>
    </SafeAreaView>
  );
}
