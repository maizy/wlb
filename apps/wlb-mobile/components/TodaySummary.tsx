import {JSX} from "react";
import {EnrichedWorkPeriods} from "wlb-intelligence/intelligence/workday";
import {StyleSheet, Text, View, ViewProps} from "react-native";

export type TodaySummaryProps = ViewProps & {
  enriched: EnrichedWorkPeriods;
};

const styles = StyleSheet.create({
  block: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontFamily: 'Merriweather_700Bold',
    minWidth: 120,
    fontSize: 16,
  },
  value: {
    fontFamily: 'Merriweather_400Regular',
    fontSize: 16,
  }
});

export function TodaySummary({enriched, style, ...otherProps}: TodaySummaryProps): JSX.Element {
  return (
    <View style={[style, styles.block]} {...otherProps}>
      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{' '}{enriched.elapsed.formatted}</Text>
      </View>
      <View  style={styles.row}>
        <Text style={styles.label}>Remaining</Text>
        <Text style={styles.value}>{' '}{enriched.remaining.formatted}</Text>
      </View>
    </View>
  );
}
