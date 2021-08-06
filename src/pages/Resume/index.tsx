import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { HistoryCard } from '../../Components/HistoryCard';
import { categories } from '../../utils/categories';
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadingContainer,
} from './styles';

interface ITransactionProps {
    type: 'up' | 'down';
    description: string;
    value: string;
    category: string;
    date: string;
}

export interface ICategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

function formattedAmount(amountToFormat: number) {
    const amount = amountToFormat
    .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    return amount;
};

export function Resume() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalByCategory, setTotalByCategory] = useState<ICategoryData[]>([]);

    const theme = useTheme();

    // Filter to select date;
    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
             setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    };

    async function request() {
        setIsLoading(false);
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        /* ***************[ONLY EXPENSIVES TRANSACTIONS]********************* */
        // 3 comparisons are made: same type, month, year;
        const expensives = responseFormatted.filter(
            (expensive: ITransactionProps) =>
            expensive.type === 'down' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );

        // Sum of expenses for all categories;
        const expensivesTotal = expensives
        .reduce((acumullator: number, expensive: ITransactionProps) => {
            return acumullator + Number(expensive.value);
        }, 0)

        const totalCategory: ICategoryData[] = [];
        
        categories.forEach(category => {

            let categorySum = 0;

            expensives.forEach((expensive: ITransactionProps) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.value)
                }
            })

            const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;
            
            if (categorySum > 0) {
                totalCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted: formattedAmount(categorySum),
                    color: category.color,
                    percent,
                })    
            }

        });
        setTotalByCategory(totalCategory);

        // **********************[STOP LOADING]*********************************
        setIsLoading(false);
    };

    useFocusEffect(useCallback(() => {
        request();
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Despesas por mês</Title>
            </Header>
            {
                isLoading ?
                    <LoadingContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size='large'
                        />
                    </LoadingContainer> :
                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('prev')}>
                                <MonthSelectIcon name='chevron-left'/>
                            </MonthSelectButton>
                            <Month>
                                { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                            </Month>
                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name='chevron-right'/>
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie 
                                data={totalByCategory}
                                x='percent'
                                y='total'
                                height={280}
                                padding={{ top: 15, bottom: 20 }}
                                colorScale={totalByCategory.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={70}
                            />
                        </ChartContainer>
                        {
                            totalByCategory.map(item => (
                                <HistoryCard 
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))

                        }
                    </Content>
            }
        </Container>
    )
};