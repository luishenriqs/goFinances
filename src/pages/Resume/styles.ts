import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ICategoryData } from '.';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background };
`;

export const Header = styled.View`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.primary };
    height: ${RFValue(113)}px;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular };
    color: ${({ theme }) => theme.colors.shape };
`;

export const ChartContainer = styled.View`
    width: 100%;
    align-items: center;
`;

export const CategoryList = styled(
    FlatList as new () => FlatList<ICategoryData>
    ).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: { 
        paddingBottom: getBottomSpace(),
        padding: 24 
    }
})``;

