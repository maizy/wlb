import {Platform, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {parseWorkPeriodsSpec} from "wlb-intelligence/parsing/workPeriod";
import {WorkPeriod} from "wlb-intelligence/data/workPeriod";
import {enrichWorkPeriods} from "wlb-intelligence/intelligence/workday";
import {WorkdaySettings} from "wlb-intelligence/data/workdaySettings";
import {Duration} from "wlb-intelligence/data/duration";
import {TodayWorkPeriods} from "@/components/TodayWorkPeriods";
import {useCurrentTime} from "@/hooks/useCurrentTime";
import useStoredState from "@/hooks/useStoredState";

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
    ...Platform.select({
      android: {
        textAlignVertical: 'top',
      },
    })
  },
});

const workdaySettings = new WorkdaySettings(new Duration(8 * 60), new Duration(60));

export default function Index() {
  const now = useCurrentTime();
  const [workPeriodsSpec, setWorkPeriodsSpec] = useStoredState<string>('work-periods', '', x => x, x => x);
  const onChange = (text: string) => {
    setWorkPeriodsSpec(text)
  };

  const lines = parseWorkPeriodsSpec(workPeriodsSpec, now);
  const periods = lines.flatMap(line => {
    return line.success && line.begin && line.end ?
      [new WorkPeriod(line.begin, line.end, false, line.assumedEnd)]
      : [];
  });
  const enriched = enrichWorkPeriods(periods, workdaySettings, now);

  return (
    <SafeAreaView style={{padding: 10}}>
      <Text style={styles.logo}>WLB</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        value={workPeriodsSpec}
        autoComplete="off"
        onChangeText={onChange}
      ></TextInput>
      <View style={{marginTop: 15}}>
        <Text style={{fontSize: 18, fontFamily: 'Merriweather_700Bold'}}>Today</Text>
        <TodayWorkPeriods periods={enriched.periods} style={{marginTop: 10}}/>
      </View>
    </SafeAreaView>
  );
}
