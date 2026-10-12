package com.campus.psychology.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AssessmentSubmitDTO {
    private String scaleId; // sds, sas
    private Map<Integer, Integer> answers; // key: 题目序号 (0~19), value: 分数 (1~4)
}
