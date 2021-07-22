import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface IContainerProps {
    color: string;
}

export const Container = styled.View<IContainerProps>`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 24px;
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;
    border-left-width: 5px;
    border-left-color: ${({ color }) => color};
    margin-bottom: 8px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
`;

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(15)}px;
`;