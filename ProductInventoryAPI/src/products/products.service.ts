import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const saved = await this.productsRepo.save(product);
    return {
      message: 'Product created successfully',
      data: saved,
    };
  }

  async findAll() {
    const [products, count] = await this.productsRepo.findAndCount({
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'All products fetched successfully',
      count,
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const updated = await this.productsRepo.save({ ...product, ...dto });
    return {
      message: 'Product updated successfully',
      data: updated,
    };
  }

  async replace(id: number, dto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const replaced = await this.productsRepo.save({ ...product, ...dto });
    return {
      message: 'Product replaced successfully',
      data: replaced,
    };
  }

  async remove(id: number) {
    const result = await this.productsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return {
      message: 'Product deleted successfully',
      id,
    };
  }

  async findByCategory(category: string) {
    const [products, count] = await this.productsRepo.findAndCount({
      where: { category },
      order: { createdAt: 'DESC' },
    });
    return {
      message: `Products in category: ${category}`,
      count,
      data: products,
    };
  }

  async search(keyword: string) {
    const [products, count] = await this.productsRepo.findAndCount({
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
    return {
      message: `Search results for keyword: ${keyword}`,
      count,
      data: products,
    };
  }

  async toggleActive(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    product.isActive = !product.isActive;
    const saved = await this.productsRepo.save(product);
    return {
      message: 'Product active status toggled successfully',
      data: saved,
    };
  }
}
