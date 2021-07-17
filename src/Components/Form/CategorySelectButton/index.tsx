import React from 'react';
import { Container, Category, Icon } from './styles';

interface IProps {
    onPress: () => void;
    title: string;
}

export function CategorySelectButton({ onPress, title }: IProps) {
    return (
        <Container onPress={onPress}>
            <Category>{title}</Category>
            <Icon name="chevron-down"/>
        </Container>
    )
};