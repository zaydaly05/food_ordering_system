package com.foodordering.mvc.service;

import com.foodordering.mvc.model.Menuitem;
import com.foodordering.mvc.repository.MenuitemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuitemService {

    private final MenuitemRepository menuitemRepository;

    public List<Menuitem> getAllMenuItems() {
        return menuitemRepository.findAll();
    }

    public List<Menuitem> getByRestaurantId(String restaurantId) {
        return menuitemRepository.findByRestaurantId(restaurantId);
    }

    public Menuitem addMenuItem(Menuitem menuitem) {
        return menuitemRepository.save(menuitem);
    }
    public void deleteMenuItem(String id) {
    menuitemRepository.deleteById(id);
}
public Menuitem updateMenuItem(
        String id,
        Menuitem updatedMenuitem
) {

    updatedMenuitem.setId(id);

    return menuitemRepository.save(updatedMenuitem);
}
}