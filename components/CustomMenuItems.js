import { MenuOption } from 'react-native-popup-menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text } from 'react-native';

export const MenuItem = ({ text, action, value, icon }) => {
    return (
        <MenuOption onSelect={() => action(value)}>
            <View style={styles.container}>
                <Text style={styles.text}>
                    {text}
                </Text>
                {icon}
            </View>
        </MenuOption>
    )
}

const styles = {
    container: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: hp(1.7),
        color: '#0F1626',
        fontWeight: '600',
    },
};