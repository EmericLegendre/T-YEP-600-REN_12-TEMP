import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Colors from '../constants/Colors'
import informationCategories from '../data/categories'
import { Entypo } from '@expo/vector-icons';

const CategoryButtons = ({ onCategorySelect }) => {

    const itemRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelectCategory = (index, category) => {
      setActiveIndex(index);
      if (onCategorySelect) {
          onCategorySelect(category);
      }
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {informationCategories.map((item, index) => (
          <View 
          key={index} 
          ref={(el) => (itemRef.current[index] == el)}
          style={styles.categoryContainer}>
            <TouchableOpacity 
            onPress={() => handleSelectCategory(index, item.title)} 
            style={styles.categoryBtn}>
              <View style={activeIndex == index ? styles.categoryBtnActive : styles.categoryIcon}>
                <Entypo 
                  name={item.iconName}
                  size={29}
                  color={activeIndex == index ? Colors.white : Colors.black}
                  />
              </View>
            </TouchableOpacity>
            <Text style={styles.categoryTitle}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default CategoryButtons

const styles = StyleSheet.create({
    categoryContainer: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 20,
        backgroundColor : Colors.white
      },
      categoryBtn: {
        alignItems: 'center',
      },
      categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.black,
        marginBottom: 5
      },
      categoryBtnActive: {
        width: 61,
        height: 61,
        borderRadius: 40,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
      },
      categoryTitle: {
        textAlign: 'center',
        color: Colors.black,
      },
})