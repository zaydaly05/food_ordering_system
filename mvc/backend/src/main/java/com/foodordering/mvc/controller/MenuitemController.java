package com.foodordering.mvc.controller;

import com.foodordering.mvc.model.Menuitem;
import com.foodordering.mvc.service.MenuitemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menuitems")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MenuitemController {

    private final MenuitemService menuitemService;

    @GetMapping
    public List<Menuitem> getAllMenuItems() {
        return menuitemService.getAllMenuItems();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Menuitem> getByRestaurantId(
            @PathVariable String restaurantId
    ) {
        return menuitemService.getByRestaurantId(restaurantId);
    }

    @PostMapping
    public Menuitem addMenuItem(
            @RequestBody Menuitem menuitem
    ) {
        return menuitemService.addMenuItem(menuitem);
    }
    @DeleteMapping("/{id}")
public void deleteMenuItem(
        @PathVariable String id
) {
    menuitemService.deleteMenuItem(id);
}
@PutMapping("/{id}")
public Menuitem updateMenuItem(
        @PathVariable String id,
        @RequestBody Menuitem menuitem
) {

    return menuitemService.updateMenuItem(
            id,
            menuitem
    );
}
}