import React from 'react';
import { FlatList } from 'react-native';
import { categories } from '../../utils/categories';
import {
    Container,
    Header,
    Title,
    Category,
    Icon,
    Name,
    Line,
} from './styles';

interface ICategory {
    key: string;
    name: string;
}

interface IProps {
    category: ICategory;
    setCategory: (category: ICategory) => void;
    closeSelectCategory: () => void;
}

export function CategorySelect({
    category,
    setCategory,
    closeSelectCategory
}: IProps) {
    const handleCategorySelect = (category: ICategory) => {
        setCategory(category);
        closeSelectCategory();
    }

    return (
        <Container>
            <Header>
                <Title>Escolha a sua categoria</Title>
            </Header>
            <FlatList
                data={categories}
                style={{flex: 1, width: '100%'}}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) =>(
                    <Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon} color={item.color}/>
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Line />}
            />
        </Container>
    )
}