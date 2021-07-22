import React from 'react';
import { Container, Title, Amount } from './styles';

interface IProps {
    color: string;
    title: string;
    amount: string
}

export function HistoryCard({color, title, amount}: IProps) {
    return (
        <Container color={color}>
            <Title>{title}</Title>
            <Amount>{amount}</Amount>
        </Container>
    )
};