import {WorkPeriod} from "wlb-intelligence/data/workPeriod";
import {StyleSheet, Text, TextStyle, View, ViewProps} from "react-native";
import {Badge} from "@/components/Badge";

const styles = StyleSheet.create({
  row: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Merriweather_400Regular',
    minWidth: 20,
  },
  badges: {
    flex: 2,
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  header: {
    fontFamily: 'Merriweather_700Bold',
  }
});

export type TodayWorkPeriodsProps = ViewProps & {
  periods: WorkPeriod[];
};

export function TodayWorkPeriods({periods, ...otherProps}: TodayWorkPeriodsProps): JSX.Element {
  const periodsRows = periods.map((period, index) => {
    const badges: JSX.Element[] = [];

    const assumedStyle: TextStyle = period.assumedEnd
      ? {fontFamily: 'Merriweather_400Regular_Italic'}
      : {};

    const estimationStyle: TextStyle = period.estimation
      ? {color: '#999'}
      : {};

    if (period.estimatedEnd) {
      badges.push(<Badge key="until" value={`until ${period.estimatedEnd.formatted}`} />);
    }
    if (period.estimation) {
      badges.push(<Badge key="estimation" value="estimation" />);
    }
    return (
      <View style={styles.row} key={`today-work-period-${index}`}>
        <Text style={[styles.cell, estimationStyle]}>{period.begin.formatted}</Text>
        <Text style={[styles.cell, assumedStyle, estimationStyle]}>{period.end.formatted}</Text>
        <Text style={[styles.cell, assumedStyle, estimationStyle]}>{period.duration.formatted}</Text>
        <View style={styles.badges}>
          {badges}
        </View>
      </View>
    );
  });

  return (
    <View {...otherProps}>
      <View style={styles.row} key="today-work-period-header">
        <Text style={[styles.cell, styles.header]}>Begin</Text>
        <Text style={[styles.cell, styles.header]}>End</Text>
        <Text style={[styles.cell, styles.header]}>Length</Text>
        <View style={[styles.badges]}></View>
      </View>
      {periodsRows}
    </View>
  );
}
