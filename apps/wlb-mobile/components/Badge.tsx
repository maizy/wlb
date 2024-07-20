import {StyleSheet, TextProps, Text} from "react-native";

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#1e90ff',
    color: 'white',
    minWidth: 50,
    borderRadius: 2.5,
    verticalAlign: 'middle',
    textAlign: 'center',
    paddingVertical: 1,
    paddingHorizontal: 3,
    fontSize: 11,
    fontFamily: 'Merriweather_400Regular',
    marginLeft: 10,
  }
});

type BadgeProps = TextProps & {
  value: string;
};

export function Badge({value, ...otherProps}: BadgeProps): JSX.Element {
  return (
    <Text style={styles.badge} {...otherProps}>
      {value}
    </Text>
  );
}
