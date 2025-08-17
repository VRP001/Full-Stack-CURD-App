package com.vedant.full.stack.backend.repository;

import com.vedant.full.stack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}

