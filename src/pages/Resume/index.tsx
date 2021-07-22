import React from 'react';
import { HistoryCard } from '../../Components/HistoryCard';
import {
    Container,
    Header,
    Title,
} from './styles';

export function Resume() {
    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            <HistoryCard 
                color='blue'
                title='Compras'
                amount='R$ 350,00'
            />

        </Container>
    )
};