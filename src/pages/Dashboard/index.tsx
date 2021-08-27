import React, { useState, useCallback } from 'react';
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
    lastDate: string;
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
    const [expensives, setExpensives] = useState<IDataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<IHighlightData>(
        {} as IHighlightData
    );

    const theme = useTheme();

    function formattedAmount(amountToFormat: number) {
        let amount = amountToFormat
        .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        amount = amount.replace('R$', 'R$ ');
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

    function getLastTransactionDate(
        collection: IDataListProps[], 
        type: 'up' | 'down'
      ) {
  
      const collectionFiltered = collection
      .filter((transaction) => transaction.type === type)
  
      if (collectionFiltered.length === 0) {
        return 0;
      }
      const lastTransaction = new Date(Math.max.apply(
        Math, collectionFiltered
          .map((transaction) => new Date(transaction.date).getTime())  
        )
      )
      const lastDate = `${lastTransaction.getDate()} de ${lastTransaction
        .toLocaleString('pt-BR', { month: 'long' })}`

      return lastDate;
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


        /* **********************[ALL TRANSACTIONS]************************** */
        // Used in listing;
        setTransaction(transactionsFormatted);
        
        /* *****************[ONLY ENTRIES TRANSACTIONS]********************** */
        // Used in listing entries;
        const transactionsEntries = transactionsFormatted.filter(
            (transactions: IDataListProps) => transactions.type === 'up'
        );
        setEntries(transactionsEntries);

        /* *******************[ONLY EXPENSIVES TRANSACTIONS]***************** */
        // Used in listing expensives;
        const transactionsExpensives = transactionsFormatted.filter(
            (transactions: IDataListProps) => transactions.type === 'down'
        );
        setExpensives(transactionsExpensives);

        
        /* *********************[LAST TRANSACTIONS DATE]********************* */
        const lastEntriesDate = getLastTransactionDate(transactions, 'up')
        const lastExpensivesDate = getLastTransactionDate(transactions, 'down')
        
        const totalInterval = lastExpensivesDate === 0 
          ? 'Não há transações' 
          : `01 a ${lastExpensivesDate}`;


        // ******************[FORMATTING HIGHLIGHT DATA]************************
        setHighlightData({
            entries: {
                amount: formattedAmount(entriesTotal),
                lastDate: lastEntriesDate === 0 
                    ? 'Não há entradas' 
                    : `Última entrada dia ${lastEntriesDate}` 
            },
            expensives: {
                amount: formattedAmount(expensivesTotal),
                lastDate: lastExpensivesDate === 0 
                    ? 'Não há saídas' 
                    : `Última saída dia ${lastExpensivesDate}`
            },
            total: {
                amount: formattedAmount(total),
                lastDate: totalInterval,
            }
        });

        /* **********************[STOP LOADING]****************************** */
        setIsLoading(false);
    }

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
                            lastTransaction={highlightData.entries.lastDate}
                            type="up"
                        />
                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastDate}
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastDate}
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
