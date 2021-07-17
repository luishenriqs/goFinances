import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface ICategoryProps {
    isActive: boolean;
};

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(90)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
`;

export const Category = styled.TouchableOpacity<ICategoryProps>`
    width: 100%;
    padding: ${RFValue(12)}px;
    flex-direction: row;
    align-items: center;
    background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors.secondary_light : theme.colors.background
    };
`;

export const Icon = styled(MaterialIcons)`
    font-size: ${RFValue(20)}px;
    margin: 0 16px;
`;

export const Name = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.text};
`;
