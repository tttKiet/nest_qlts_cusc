import { Injectable } from '@nestjs/common';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';
import { chuyende } from 'src/entites/chuyende.entity';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { truong } from 'src/entites/truong.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ThematicService {
  constructor(
    @InjectRepository(chuyende)
    private chuyendeRepository: Repository<chuyende>,
  ) {}

  async create(drops: CreateThematicDto) {
    const {
      TENCHUYENDE,
      THOIGIANTHONGBAO,
      THOIGIANTOCHUCCHUYENDE,
      NOIDUNG,
      MATRUONG,
      SDT,
    } = drops;

    const chuyende = this.chuyendeRepository.create({
      TENCHUYENDE: TENCHUYENDE,
      THOIGIANTHONGBAO: THOIGIANTHONGBAO,
      THOIGIANTOCHUCCHUYENDE: THOIGIANTOCHUCCHUYENDE,
      NOIDUNG: NOIDUNG,
      MATRUONG: MATRUONG,
      SDT: SDT,
    });

    await this.chuyendeRepository.save(chuyende, {
      reload: true,
    });

    return chuyende;
  }

  async readAll(drops: IFThematic) {
    const { MACHUYENDE, TRANGTHAI, SDT, page, pageSize } = drops;

    let condition: Partial<IFThematic> = {};

    const queryBuilder = this.chuyendeRepository.createQueryBuilder('chuyende');

    if (MACHUYENDE) {
      queryBuilder.where('chuyende.MACHUYENDE = :MACHUYENDE', { MACHUYENDE });
    }

    if (SDT) {
      queryBuilder.andWhere('chuyende.SDT = :SDT', { SDT });
    }

    if (TRANGTHAI) {
      queryBuilder.where('chitietchuyende.TRANGTHAI = :TRANGTHAI', {
        TRANGTHAI,
      });
    }

    queryBuilder
      .leftJoinAndSelect('chuyende.truong', 'truong')
      .leftJoinAndSelect('truong.khachhang', 'khachhang')
      .leftJoinAndSelect('chuyende.chitietchuyende', 'chitietchuyende')
      .leftJoinAndSelect('chuyende.usermanager', 'usermanager');

    // Thêm các tùy chọn phân trang nếu có
    if (page !== undefined && pageSize !== undefined) {
      queryBuilder.take(pageSize);
      queryBuilder.skip((page - 1) * pageSize);
    }
    const [data, totalRows] = await queryBuilder.getManyAndCount();
    return {
      totalRows: totalRows,
      results: data,
    };
  }

  async update(drops: IFThematic) {
    const {
      MACHUYENDE,
      TENCHUYENDE,
      THOIGIANTHONGBAO,
      THOIGIANTOCHUCCHUYENDE,
      NOIDUNG,
      MATRUONG,
      SDT,
    } = drops;

    const existingChuyende = await this.chuyendeRepository.findOne({
      where: { MACHUYENDE: MACHUYENDE },
    });

    if (!existingChuyende) {
      throw new Error(`Chuyên đề với MACHUYENDE ${MACHUYENDE} không tồn tại.`);
    }

    let condition: Partial<IFThematic> = {};
    if (TENCHUYENDE) {
      condition.TENCHUYENDE = TENCHUYENDE;
    }
    if (THOIGIANTHONGBAO) {
      condition.THOIGIANTHONGBAO = THOIGIANTHONGBAO;
    }
    if (THOIGIANTOCHUCCHUYENDE) {
      condition.THOIGIANTOCHUCCHUYENDE = THOIGIANTOCHUCCHUYENDE;
    }
    if (NOIDUNG) {
      condition.NOIDUNG = NOIDUNG;
    }
    if (MATRUONG) {
      condition.MATRUONG = MATRUONG;
    }
    if (SDT) {
      condition.SDT = SDT;
    }

    return await this.chuyendeRepository.update(
      {
        MACHUYENDE: MACHUYENDE,
      },
      condition,
    );
  }

  async delete(drops: IFThematic) {
    const { MACHUYENDE } = drops;

    const existingChuyende = await this.chuyendeRepository.findOne({
      where: { MACHUYENDE: MACHUYENDE },
    });

    if (!existingChuyende) {
      // Nếu không tồn tại, trả về thông báo lỗi
      throw new Error(`Chuyên đề với MACHUYENDE ${MACHUYENDE} không tồn tại.`);
    }

    return this.chuyendeRepository.delete({
      MACHUYENDE: MACHUYENDE,
    });
  }
}
