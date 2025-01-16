-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2025 at 07:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resource_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `allocations`
--

CREATE TABLE `allocations` (
  `id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allocations`
--

INSERT INTO `allocations` (`id`, `resource_id`, `project_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-01-01 09:00:00', '2024-01-31 17:00:00', 'Active', '2025-01-13 09:08:55', '2025-01-13 09:08:55'),
(2, 2, 2, '2024-01-15 13:00:00', '2024-01-15 15:00:00', 'Active', '2025-01-13 09:08:55', '2025-01-13 09:08:55'),
(3, 1, 1, '2025-01-13 17:34:00', '2025-01-13 17:34:00', 'Active', '2025-01-13 12:04:38', '2025-01-13 12:04:38'),
(5, 1, 1, '2025-01-13 17:36:00', '2025-01-13 17:36:00', 'Active', '2025-01-13 12:06:29', '2025-01-13 12:06:29'),
(6, 1, 1, '2025-01-13 17:38:00', '2025-01-13 17:38:00', 'Active', '2025-01-13 12:08:08', '2025-01-13 12:08:08'),
(21, 3, 3, '2025-01-30 00:23:00', '2025-02-08 11:29:00', 'Active', '2025-01-13 13:53:30', '2025-01-13 13:53:30'),
(22, 8, 4, '2025-01-15 08:25:00', '2025-02-05 22:22:00', 'Active', '2025-01-15 14:52:53', '2025-01-15 14:52:53'),
(23, 5, 2, '2025-02-01 20:58:00', '2025-03-01 20:58:00', 'Active', '2025-01-15 15:29:03', '2025-01-15 15:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Website Redesign', 'Company website redesign project', 'Active', '2025-01-13 09:08:55', '2025-01-13 09:08:55'),
(2, 'Mobile App Development', 'Customer loyalty app development', 'Active', '2025-01-13 09:08:55', '2025-01-13 09:08:55'),
(3, 'Cloud Migration', 'Migration of legacy systems to cloud platforms', 'Active', '2025-01-13 12:14:38', '2025-01-13 12:14:38'),
(4, 'VR Game Development', 'Virtual reality gaming application project', 'Active', '2025-01-13 12:14:38', '2025-01-13 12:14:38'),
(5, 'Marketing Campaign', 'Social media marketing campaign development', 'Active', '2025-01-13 12:14:38', '2025-01-13 12:14:38');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Available','In Use','Under Maintenance') DEFAULT 'Available',
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `name`, `description`, `status`, `category`, `created_at`, `updated_at`) VALUES
(1, 'Laptop Dell XPS', 'High-performance developer laptop', 'Available', 'Equipment', '2025-01-13 09:08:55', '2025-01-15 14:51:14'),
(2, 'Meeting Room A', 'Conference room with projector', 'Available', 'Facility', '2025-01-13 09:08:55', '2025-01-15 15:25:51'),
(3, '3D Printer', 'Ultimaker S5 Pro', 'Under Maintenance', 'Equipment', '2025-01-13 09:08:55', '2025-01-13 14:34:47'),
(4, 'Tablet iPad Pro', 'Creative design tablet', 'In Use', 'Equipment', '2025-01-13 12:14:38', '2025-01-15 15:28:23'),
(5, 'Camera Nikon D750', 'High-resolution DSLR camera', 'In Use', 'Equipment', '2025-01-13 12:14:38', '2025-01-15 14:04:35'),
(6, 'Lab Workstation', 'Custom-built PC for simulations', 'Available', 'Equipment', '2025-01-13 12:14:38', '2025-01-15 15:03:48'),
(7, 'Meeting Room B', 'Small meeting room with whiteboard', 'Available', 'Facility', '2025-01-13 12:14:38', '2025-01-13 12:14:38'),
(8, 'Virtual Reality Set', 'Oculus Rift VR Kit', 'Available', 'Equipment', '2025-01-13 12:14:38', '2025-01-13 12:14:38'),
(9, 'Shared Desk', 'Hot-desking space with monitor', 'Under Maintenance', 'Facility', '2025-01-13 12:14:38', '2025-01-13 14:35:21');

-- --------------------------------------------------------

--
-- Table structure for table `usage_history`
--

CREATE TABLE `usage_history` (
  `id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allocations`
--
ALTER TABLE `allocations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resource_id` (`resource_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usage_history`
--
ALTER TABLE `usage_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resource_id` (`resource_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allocations`
--
ALTER TABLE `allocations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `usage_history`
--
ALTER TABLE `usage_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `allocations`
--
ALTER TABLE `allocations`
  ADD CONSTRAINT `allocations_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`),
  ADD CONSTRAINT `allocations_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Constraints for table `usage_history`
--
ALTER TABLE `usage_history`
  ADD CONSTRAINT `usage_history_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
