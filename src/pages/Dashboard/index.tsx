import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../Components/HighlightCard';
import { 
    TransactionCard, ITransactionCardProps,
} from '../../Components/TransactionCard';
import {
    Container,
    LoadingContainer,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    LogoutButton,
    Icon,
    Cards,
    Transactions,
    Title,
    TransactionList,
} from './styles';

export interface IDataListProps extends ITransactionCardProps {
    id: string;
}

interface IHighlightProps {
    amount: string;
    lastTransaction: string;
}

interface IHighlightData {
    entries: IHighlightProps;
    expensives: IHighlightProps;
    total: IHighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transaction, setTransaction] = useState<IDataListProps[]>([]);
    const [entries, setEntries] = useState<IDataListProps[]>([]);
    const [firstEntrie, setFirstEntrie] = useState<IDataListProps>({} as IDataListProps);
    const [lastEntrie, setLastEntrie] = useState<IDataListProps>({} as IDataListProps);
    const [expensives, setExpensives] = useState<IDataListProps[]>([]);
    const [firstExpensive, setFirstExpensive] = useState<IDataListProps>({} as IDataListProps);
    const [lastExpensive, setLastExpensive] = useState<IDataListProps>({} as IDataListProps);
    const [highlightData, setHighlightData] = useState<IHighlightData>(
        {} as IHighlightData
    );

    const theme = useTheme();

    function formattedAmount(amountToFormat: number) {
        const amount = amountToFormat
        .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return amount;
    };

    function formattedDate(dateToFormat: string) {
        const date = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).format(new Date(dateToFormat));
        return date;
    };

    function formattedTransaction(transactionsToFormat: IDataListProps[]) {
        let entriesTotal = 0;
        let expensivesTotal = 0;
        let total = 0;
        const transactionsFormatted: IDataListProps[] = transactionsToFormat
        .map((item: IDataListProps) => {
            if (item.type === 'up') {
                entriesTotal += Number(item.value);
            } else {
                expensivesTotal += Number(item.value);
            }
            total = entriesTotal - expensivesTotal;
            const value = formattedAmount(Number(item.value));
            const date = formattedDate(item.date)
            return {
                id: item.id,
                description: item.description,
                type: item.type,
                category: item.category,
                value,
                date,
            }
        });
        return {transactionsFormatted, entriesTotal, expensivesTotal, total};
    };

    function getDayAndMonth(date: Date) {
        const dateToGetDay = new Date(date);
        const day = dateToGetDay.getDate();
        const month = dateToGetDay.toLocaleString('pt-BR', { month: 'long' })
        return {day, month};
    };

    async function request() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        const {
            transactionsFormatted,
            entriesTotal,
            expensivesTotal,
            total
        } = formattedTransaction(transactions);


        // **********************[ALL TRANSACTIONS]*****************************
        setTransaction(transactionsFormatted);
        
        // *****************[ONLY ENTRIES TRANSACTIONS]*************************
        const transactionsEntries = transactionsFormatted.filter(
            (transactions: IDataListProps) => transactions.type === 'up'
        );
        setEntries(transactionsEntries);

        // ************[FIRST AND LAST ENTRIES TRANSACTIONS]********************
        const firstEntrie = transactionsEntries[0];
        const indexEntrie = transactionsEntries.length - 1;
        const lastEntrie = transactionsEntries[indexEntrie];
        setFirstEntrie(firstEntrie);
        setLastEntrie(lastEntrie);

        // ******************[DAY AND MONTH OF ENTRIES]*************************
        const onlyEntries = transactions.filter(
            (transactions: IDataListProps) => transactions.type === 'up'
        );
        const firstDayAndMonthEntries = getDayAndMonth(new Date(onlyEntries[0].date));
        
        const lastIndexEntrie = onlyEntries.length - 1;
        const lastDayAndMonthEntries = getDayAndMonth(
            new Date(onlyEntries[lastIndexEntrie].date));

        // ***************[ONLY EXPENSIVES TRANSACTIONS]************************
        const transactionsExpensives = transactionsFormatted.filter(
            (transactions: IDataListProps) => transactions.type === 'down'
        );
        setExpensives(transactionsExpensives);

        // **********[FIRST AND LAST EXPENSIVES TRANSACTIONS]*******************
        const firstExpensive = transactionsExpensives[0];
        const indexExpensive = transactionsExpensives.length - 1;
        const lastExpensive = transactionsExpensives[indexExpensive];
        setFirstExpensive(firstExpensive);
        setLastExpensive(lastExpensive);

        // ****************[DAY AND MONTH OF EXPENSIVES]************************
        const onlyExpensives = transactions.filter(
            (transactions: IDataListProps) => transactions.type === 'down'
        );
        const firstDayAndMonthExpensive = getDayAndMonth(
            new Date(onlyExpensives[0].date));
        
        const lastIndexExpensive = onlyExpensives.length - 1;
        const lastDayAndMonthExpensives = getDayAndMonth(
            new Date(onlyExpensives[lastIndexExpensive].date));

        // **********************[FORMATTING AMOUNT]****************************
        setHighlightData({
            entries: {
                amount: formattedAmount(entriesTotal),
                lastTransaction: 
                `Última entrada dia ${lastDayAndMonthEntries.day} de ${lastDayAndMonthEntries.month}`,
            },
            expensives: {
                amount: formattedAmount(expensivesTotal),
                lastTransaction:
                `Última saída dia ${lastDayAndMonthExpensives.day} de ${lastDayAndMonthExpensives.month}`,
            },
            total: {
                amount: formattedAmount(total),
                lastTransaction: 
                ``,
            }
        });

        // **********************[STOP LOADING]*********************************
        setIsLoading(false);
    }

    useEffect(() => {
        request();
    }, []);

    useFocusEffect(useCallback(() => {
        request();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadingContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size='large'
                        />
                    </LoadingContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo 
                                    source={{uri: 'https://avatars.githubusercontent.com/u/63956850?v=4'}}
                                />
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>Luís Henrique</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => {}}> 
                                <Icon name="power"/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>
                    <Cards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                            type="up"
                        />
                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction="01 à dia 16 de abril"
                            type="total"
                        />
                    </Cards> 
                    
                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList 
                            data={transaction}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}
