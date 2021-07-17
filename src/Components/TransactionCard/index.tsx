import React from 'react';
import { categories } from '../../utils/categories';
import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles';

export interface ITransactionCardProps {
    type: 'up' | 'down';
    description: string;
    value: string;
    category: string;
    date: string;
}

interface IProps {
    data: ITransactionCardProps;
}

export const TransactionCard = ({ data }: IProps) => {
    const [category] = categories.filter(item => item.key === data.category);
    return (
        <Container>
            <Title>{data.description}</Title>
            <Amount type={data.type}>
                {data.type === 'down' && '- '}
                {data.value}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}