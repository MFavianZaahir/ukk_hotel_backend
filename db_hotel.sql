-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 07, 2024 at 12:01 PM
-- Server version: 5.7.33
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pemesanan`
--

CREATE TABLE `detail_pemesanan` (
  `id_detail_pemesanan` int(11) NOT NULL,
  `id_pemesanan` int(11) DEFAULT NULL,
  `id_kamar` int(11) DEFAULT NULL,
  `tgl_akses` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `detail_pemesanan`
--

INSERT INTO `detail_pemesanan` (`id_detail_pemesanan`, `id_pemesanan`, `id_kamar`, `tgl_akses`, `harga`, `createdAt`, `updatedAt`) VALUES
(52, 10, 1, '2024-10-05 00:00:00', 250000, '2024-10-05 09:37:06', '2024-10-05 09:37:06'),
(53, 10, 2, '2024-10-05 00:00:00', 250000, '2024-10-05 09:37:06', '2024-10-05 09:37:06'),
(54, 10, 3, '2024-10-05 00:00:00', 250000, '2024-10-05 09:37:06', '2024-10-05 09:37:06');

-- --------------------------------------------------------

--
-- Table structure for table `kamar`
--

CREATE TABLE `kamar` (
  `id_kamar` int(11) NOT NULL,
  `nomor_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kamar`
--

INSERT INTO `kamar` (`id_kamar`, `nomor_kamar`, `id_tipe_kamar`, `createdAt`, `updatedAt`) VALUES
(5, 501, 4, '2024-10-03 07:52:13', '2024-10-04 07:52:13'),
(5, 502, 4, '2024-10-04 07:52:13', '2024-10-05 07:52:13'),
(5, 503, 4, '2024-10-05 07:52:13', '2024-10-06 07:52:13'),

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `foto` text,
  `slug` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id_pelanggan`, `nama`, `foto`, `slug`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Pelanggan', 'http://localhost:8000/usr/image.jpg', 'pelanggan', 'pelanggan@mail.com', '21232f297a57a5a743894a0e4a801fc3', 'pelanggan', '2024-10-02 07:46:26', '2024-03-04 14:44:02'),
(2, 'Customer', 'http://localhost:8000/usr/image.jpeg', 'customer', 'customer@mail.com', '21232f297a57a5a743894a0e4a801fc3', 'pelanggan', '2024-10-05 09:23:52', '2024-10-05 09:23:52');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE `pemesanan` (
  `id_pemesanan` int(11) NOT NULL,
  `nomor_pemesanan` varchar(255) DEFAULT NULL,
  `id_pelanggan` int(11) DEFAULT NULL,
  `tgl_pemesanan` datetime DEFAULT NULL,
  `tgl_check_in` datetime DEFAULT NULL,
  `tgl_check_out` datetime DEFAULT NULL,
  `nama_tamu` varchar(255) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` int(11) DEFAULT NULL,
  `status_pemesanan` enum('baru','check_in','check_out') DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `email_pemesanan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pemesanan`
--

INSERT INTO `pemesanan` (`id_pemesanan`, `nomor_pemesanan`, `id_pelanggan`, `tgl_pemesanan`, `tgl_check_in`, `tgl_check_out`, `nama_tamu`, `email_pemesanan` `jumlah_kamar`, `id_tipe_kamar`, `status_pemesanan`, `id_user`, `createdAt`, `updatedAt`) VALUES
(10, 'WH-527392205', 1, '2024-10-05 09:37:06', '2024-10-05 00:00:00', '2024-03-06 00:00:00', 'Pelanggan', 'pelanggan@mail.com', 3, 4, 'check_in', 2, '2024-10-05 09:37:06', '2024-10-05 11:21:03');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('1-create-user.js'),
('2-create-tipe-kamar.js'),
('3-create-kamar.js'),
('4-create-pelanggan.js'),
('5-create-pemesanan.js'),
('6-create-detail-pemesanan.js');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_kamar`
--

CREATE TABLE `tipe_kamar` (
  `id_tipe_kamar` int(11) NOT NULL,
  `nama_tipe_kamar` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` text,
  `foto` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tipe_kamar`
--

INSERT INTO `tipe_kamar` (`id_tipe_kamar`, `nama_tipe_kamar`, `slug`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'Luxury Room', 'luxury-room', 500000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate ante non odio rutrum mattis. Donec vulputate scelerisque justo, sed imperdiet metus. Etiam dictum nisi vitae malesuada interdum. Integer ac dictum mauris. Fusce at libero est. Nullam rhoncus quis mi vel ullamcorper. Donec luctus, lectus vel accumsan vehicula, tortor dolor fringilla sem, sed fermentum turpis metus nec sapien. Praesent sapien quam, vehicula in dictum eu, fringilla ac tortor. Nullam a risus non quam tempus ultrices. Donec dapibus tortor ex. Aliquam tincidunt in est a tempor. Donec quis ante at nibh varius tincidunt. Morbi ut arcu arcu.&nbsp;</p>', 'http://localhost:8000/img/tes-1677743321409.jpeg', '2024-10-02 07:48:41', '2024-10-02 07:48:41'),
(2, 'Double Room', 'double-room', 450000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate ante non odio rutrum mattis. Donec vulputate scelerisque justo, sed imperdiet metus. Etiam dictum nisi vitae malesuada interdum. Integer ac dictum mauris. Fusce at libero est. Nullam rhoncus quis mi vel ullamcorper. Donec luctus, lectus vel accumsan vehicula, tortor dolor fringilla sem, sed fermentum turpis metus nec sapien. Praesent sapien quam, vehicula in dictum eu, fringilla ac tortor. Nullam a risus non quam tempus ultrices. Donec dapibus tortor ex. Aliquam tincidunt in est a tempor. Donec quis ante at nibh varius tincidunt. Morbi ut arcu arcu.&nbsp;</p>', 'http://localhost:8000/img/tes4-1677743440157.jpg', '2024-10-02 07:50:40', '2024-10-02 07:50:40'),
(3, 'Single Room', 'single-room', 350000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate ante non odio rutrum mattis. Donec vulputate scelerisque justo, sed imperdiet metus. Etiam dictum nisi vitae malesuada interdum. Integer ac dictum mauris. Fusce at libero est. Nullam rhoncus quis mi vel ullamcorper. Donec luctus, lectus vel accumsan vehicula, tortor dolor fringilla sem, sed fermentum turpis metus nec sapien. Praesent sapien quam, vehicula in dictum eu, fringilla ac tortor. Nullam a risus non quam tempus ultrices. Donec dapibus tortor ex. Aliquam tincidunt in est a tempor. Donec quis ante at nibh varius tincidunt. Morbi ut arcu arcu.&nbsp;</p>', 'http://localhost:8000/img/tes-3-1677743470121.jpg', '2024-10-02 07:51:10', '2024-10-02 07:51:10'),
(4, 'Twin Room', 'twin-room', 250000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate ante non odio rutrum mattis. Donec vulputate scelerisque justo, sed imperdiet metus. Etiam dictum nisi vitae malesuada interdum. Integer ac dictum mauris. Fusce at libero est. Nullam rhoncus quis mi vel ullamcorper. Donec luctus, lectus vel accumsan vehicula, tortor dolor fringilla sem, sed fermentum turpis metus nec sapien. Praesent sapien quam, vehicula in dictum eu, fringilla ac tortor. Nullam a risus non quam tempus ultrices. Donec dapibus tortor ex. Aliquam tincidunt in est a tempor. Donec quis ante at nibh varius tincidunt. Morbi ut arcu arcu.&nbsp;</p>', 'http://localhost:8000/img/tes-2-1677743485027.jpg', '2024-10-02 07:51:25', '2024-10-02 07:51:25');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `nama_user` varchar(255) DEFAULT NULL,
  `foto` text,
  `slug` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text,
  `role` enum('admin','resepsionis') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `nama_user`, `foto`, `slug`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'http://localhost:8000/usr/image.jpg', 'admin', 'admin@mail.com', '21232f297a57a5a743894a0e4a801fc3', 'admin', '2024-10-02 07:44:44', '2024-10-02 07:44:44'),
(2, 'Resepsionis', 'http://localhost:8000/usr/image.jpg', 'resepsionis', 'resepsionis@mail.com', '21232f297a57a5a743894a0e4a801fc3', 'resepsionis', '2024-10-05 09:49:32', '2024-10-05 09:49:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pemesanan`
--
ALTER TABLE `detail_pemesanan`
  ADD PRIMARY KEY (`id_detail_pemesanan`),
  ADD KEY `id_pemesanan` (`id_pemesanan`),
  ADD KEY `id_kamar` (`id_kamar`);

--
-- Indexes for table `kamar`
--
ALTER TABLE `kamar`
  ADD PRIMARY KEY (`id_kamar`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id_pemesanan`),
  ADD KEY `id_pelanggan` (`id_pelanggan`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tipe_kamar`
--
ALTER TABLE `tipe_kamar`
  ADD PRIMARY KEY (`id_tipe_kamar`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pemesanan`
--
ALTER TABLE `detail_pemesanan`
  MODIFY `id_detail_pemesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `kamar`
--
ALTER TABLE `kamar`
  MODIFY `id_kamar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id_pemesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tipe_kamar`
--
ALTER TABLE `tipe_kamar`
  MODIFY `id_tipe_kamar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pemesanan`
--
ALTER TABLE `detail_pemesanan`
  ADD CONSTRAINT `detail_pemesanan_ibfk_1` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanan` (`id_pemesanan`),
  ADD CONSTRAINT `detail_pemesanan_ibfk_2` FOREIGN KEY (`id_kamar`) REFERENCES `kamar` (`id_kamar`);

--
-- Constraints for table `kamar`
--
ALTER TABLE `kamar`
  ADD CONSTRAINT `kamar_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamar` (`id_tipe_kamar`);

--
-- Constraints for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`),
  ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamar` (`id_tipe_kamar`),
  ADD CONSTRAINT `pemesanan_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
