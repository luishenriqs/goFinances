import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { HistoryCard } from '../../Components/HistoryCard';
import { categories } from '../../utils/categories';
import {
    Container,
    Header,
    Title,
    ChartContainer,
    CategoryList,
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
    const [totalByCategory, setTotalByCategory] = useState<ICategoryData[]>([]);

    const theme = useTheme();

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        // ***************[ONLY EXPENSIVES TRANSACTIONS]************************
        const expensives = responseFormatted.filter(
            (transactions: ITransactionProps) => transactions.type === 'down'
        );

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
    }

    useEffect(() => {
        loadData();
    },[]);

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
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
            <CategoryList 
                data={totalByCategory}
                keyExtractor={item => item.key}
                renderItem={({ item }) => 
                <HistoryCard 
                    title={item.name}
                    amount={item.totalFormatted}
                    color={item.color}
                />}
            />
        </Container>
    )
};