import { Injectable } from '@nestjs/common';
import { CreateMisscallDto, readMisscallDto } from './dto/create-misscall.dto';
import { UpdateMisscallDto } from './dto/update-misscall.dto';
import { misscall } from 'src/entites/misscall.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { relative } from 'path';
import { lienhe } from 'src/entites/lienhe.entity';
import { khachhang } from 'src/entites/khachhang.entity';

@Injectable()
export class MisscallService {
  constructor(
    @InjectRepository(misscall)
    private misscallRepository: Repository<misscall>,
    @InjectRepository(lienhe)
    private lienheRepository: Repository<lienhe>,
  ) {}

  async create(body: CreateMisscallDto) {
    const { SDT, thoigian, TRANGTHAI, MALIENHE } = body;
    const condition: Partial<CreateMisscallDto> = {};

    if (SDT) {
      condition.SDT = SDT;
    }

    if (MALIENHE) {
      condition.MALIENHE = MALIENHE;
    }

    if (thoigian) {
      condition.thoigian = thoigian;
    }
    if (TRANGTHAI) {
      condition.TRANGTHAI = TRANGTHAI;
    }

    const misscall = this.misscallRepository.create(condition);

    await this.misscallRepository.save(misscall, {
      reload: true,
    });

    return misscall;
  }

  async findAll_MS_UM(query: Partial<readMisscallDto>) {
    const { SDT, TRANGTHAI } = query;

    const queryLH = this.lienheRepository.createQueryBuilder('lh');
    queryLH
      .leftJoinAndSelect('lh.misscall', 'misscall')
      .leftJoinAndSelect('lh.khachhang', 'khachhang');

    if (SDT) {
      queryLH.where('lh.SDT = :SDT', {
        SDT: SDT,
      });
    }

    if (TRANGTHAI) {
      queryLH.where('misscall.TRANGTHAI = :TRANGTHAI', {
        TRANGTHAI: TRANGTHAI,
      });
    }

    const data = await queryLH.getMany();
    return data;
  }

  async update(body: UpdateMisscallDto) {
    const { MAMISSCALL, thoigian, TRANGTHAI } = body;

    // Tạo một đối tượng chứa các giá trị cần cập nhật
    const updateNote: Partial<UpdateMisscallDto> = {};

    if (thoigian !== undefined) {
      updateNote.thoigian = thoigian;
    }
    if (TRANGTHAI !== undefined) {
      updateNote.TRANGTHAI = TRANGTHAI;
    }

    // Thực hiện cập nhật dữ liệu vào cơ sở dữ liệu
    const note = await this.misscallRepository.findOne({
      where: {
        MAMISSCALL: MAMISSCALL,
      },
    });
    if (!note) {
      throw new Error('Không tìm thấy ghi chú để cập nhật');
    }

    return await this.misscallRepository.update(
      {
        MAMISSCALL: MAMISSCALL,
      },
      updateNote,
    );
  }

  async remove(MAMISSCALL: number) {
    const misscall = await this.misscallRepository.findOne({
      where: {
        MAMISSCALL: MAMISSCALL,
      },
    });
    if (!misscall) {
      throw new Error(`Không tìm thấy ghi chú có id ${MAMISSCALL} để xóa`);
    }

    return await this.misscallRepository.remove(misscall);
  }
}
