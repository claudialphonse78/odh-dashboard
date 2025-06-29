export const lmEvalTasks = [
  { value: 'gsm8k', content: 'gsm8k' },
  { value: 'c4', content: 'c4' },
  { value: 'chain_of_thought', content: 'chain_of_thought' },
  { value: 'mnli', content: 'mnli' },
  { value: 'sst2', content: 'sst2' },
  { value: 'rte', content: 'rte' },
  { value: 'qnli', content: 'qnli' },
  { value: 'mrpc', content: 'mrpc' },
  { value: 'qqp', content: 'qqp' },
  { value: 'wnli', content: 'wnli' },
  { value: 'cola', content: 'cola' },
  { value: 'glue', content: 'glue' },
  { value: 'arc_easy', content: 'arc_easy' },
  { value: 'arc_challenge', content: 'arc_challenge' },
  { value: 'ai2_arc', content: 'ai2_arc' },
  { value: 'llama', content: 'llama' },
  { value: 'openllm', content: 'openllm' },
  { value: 'hellaswag', content: 'hellaswag' },
  { value: 'winogrande', content: 'winogrande' },
  { value: 'mmlu', content: 'mmlu' },
  { value: 'mmlu_cot_llama', content: 'mmlu_cot_llama' },
  { value: 'mmlu_llama', content: 'mmlu_llama' },
  { value: 'mmlu_flan_cot_zeroshot', content: 'mmlu_flan_cot_zeroshot' },
  { value: 'mmlu_continuation', content: 'mmlu_continuation' },
  { value: 'mmlu_flan_n_shot_loglikelihood', content: 'mmlu_flan_n_shot_loglikelihood' },
  { value: 'mmlu_flan_cot_fewshot', content: 'mmlu_flan_cot_fewshot' },
  { value: 'copa', content: 'copa' },
  { value: 'cb', content: 'cb' },
  { value: 'super_glue-cb-t5-prompt', content: 'super_glue-cb-t5-prompt' },
  { value: 'wic', content: 'wic' },
  { value: 'super_glue-wic-t5-prompt', content: 'super_glue-wic-t5-prompt' },
  { value: 'super_glue-rte-t5-prompt', content: 'super_glue-rte-t5-prompt' },
  { value: 'boolq', content: 'boolq' },
  { value: 'super_glue-boolq-t5-prompt', content: 'super_glue-boolq-t5-prompt' },
  { value: 'sglue_rte', content: 'sglue_rte' },
  { value: 'multirc', content: 'multirc' },
  { value: 'super_glue-multirc-t5-prompt', content: 'super_glue-multirc-t5-prompt' },
  { value: 'record', content: 'record' },
  { value: 'super_glue-record-t5-prompt', content: 'super_glue-record-t5-prompt' },
  { value: 'wsc', content: 'wsc' },
  { value: 'super_glue-wsc-t5-prompt', content: 'super_glue-wsc-t5-prompt' },
  { value: 'super-glue-lm-eval-v1', content: 'super-glue-lm-eval-v1' },
  { value: 'super-glue-lm-eval-v1-seq2seq', content: 'super-glue-lm-eval-v1-seq2seq' },
  { value: 'super_glue-copa-t5-prompt', content: 'super_glue-copa-t5-prompt' },
  { value: 'super-glue-t5-prompt', content: 'super-glue-t5-prompt' },
  { value: 'openbookqa', content: 'openbookqa' },
  { value: 'multimedqa', content: 'multimedqa' },
  { value: 'multiple_choice', content: 'multiple_choice' },
  { value: 'commonsense_qa', content: 'commonsense_qa' },
  { value: 'flan_held_out', content: 'flan_held_out' },
  { value: 'pythia', content: 'pythia' },
  { value: 'lambada_multilingual', content: 'lambada_multilingual' },
  { value: 'lambada_openai', content: 'lambada_openai' },
  { value: 'lambada', content: 'lambada' },
  { value: 'lambada_standard', content: 'lambada_standard' },
  { value: 'math_word_problems', content: 'math_word_problems' },
  { value: 'humaneval', content: 'humaneval' },
  { value: 'longbench', content: 'longbench' },
  { value: 'wsc273', content: 'wsc273' },
  {
    value: 'score_non_greedy_robustness_mmlu_pro',
    content: 'score_non_greedy_robustness_mmlu_pro',
  },
  { value: 'score_robustness_mmlu_pro', content: 'score_robustness_mmlu_pro' },
  { value: 'mmlu_pro', content: 'mmlu_pro' },
  {
    value: 'score_option_order_robustness_mmlu_pro',
    content: 'score_option_order_robustness_mmlu_pro',
  },
  { value: 'score_prompt_robustness_mmlu_pro', content: 'score_prompt_robustness_mmlu_pro' },
  { value: 'leaderboard_mmlu_pro', content: 'leaderboard_mmlu_pro' },
  { value: 'gpqa', content: 'gpqa' },
  { value: 'leaderboard_gpqa', content: 'leaderboard_gpqa' },
  { value: 'xnli', content: 'xnli' },
  { value: 'french_bench_xnli', content: 'french_bench_xnli' },
  { value: 'mbpp', content: 'mbpp' },
  { value: 'truthfulqa', content: 'truthfulqa' },
  { value: 'wikitext', content: 'wikitext' },
  { value: 'mmmu_val', content: 'mmmu_val' },
  {
    value: 'prompt_robustness_math_counting_and_prob',
    content: 'prompt_robustness_math_counting_and_prob',
  },
  { value: 'prompt_robustness_math_prealgebra', content: 'prompt_robustness_math_prealgebra' },
  { value: 'prompt_robustness_math_num_theory', content: 'prompt_robustness_math_num_theory' },
  {
    value: 'non_greedy_robustness_math_prealgebra',
    content: 'non_greedy_robustness_math_prealgebra',
  },
  {
    value: 'non_greedy_robustness_math_intermediate_algebra',
    content: 'non_greedy_robustness_math_intermediate_algebra',
  },
  { value: 'prompt_robustness_math_precalc', content: 'prompt_robustness_math_precalc' },
  {
    value: 'non_greedy_robustness_math_num_theory',
    content: 'non_greedy_robustness_math_num_theory',
  },
  { value: 'prompt_robustness_math_algebra', content: 'prompt_robustness_math_algebra' },
  { value: 'non_greedy_robustness_math_precalc', content: 'non_greedy_robustness_math_precalc' },
  { value: 'non_greedy_robustness_math_algebra', content: 'non_greedy_robustness_math_algebra' },
  {
    value: 'prompt_robustness_math_intermediate_algebra',
    content: 'prompt_robustness_math_intermediate_algebra',
  },
  { value: 'prompt_robustness_math_geometry', content: 'prompt_robustness_math_geometry' },
  { value: 'non_greedy_robustness_math_geometry', content: 'non_greedy_robustness_math_geometry' },
  {
    value: 'non_greedy_robustness_math_counting_and_prob',
    content: 'non_greedy_robustness_math_counting_and_prob',
  },
  { value: 'score_non_greedy_robustness_math', content: 'score_non_greedy_robustness_math' },
  { value: 'score_prompt_robustness_math', content: 'score_prompt_robustness_math' },
  { value: 'minerva_math', content: 'minerva_math' },
  { value: 'score_robustness_math', content: 'score_robustness_math' },
  { value: 'hendrycks_math', content: 'hendrycks_math' },
  { value: 'score_robustness', content: 'score_robustness' },
  { value: 'piqa', content: 'piqa' },
  { value: 'leaderboard_math_num_theory_hard', content: 'leaderboard_math_num_theory_hard' },
  { value: 'leaderboard_math_algebra_hard', content: 'leaderboard_math_algebra_hard' },
  { value: 'leaderboard_math_prealgebra_hard', content: 'leaderboard_math_prealgebra_hard' },
  {
    value: 'leaderboard_math_intermediate_algebra_hard',
    content: 'leaderboard_math_intermediate_algebra_hard',
  },
  { value: 'leaderboard_math_geometry_hard', content: 'leaderboard_math_geometry_hard' },
  { value: 'leaderboard_math_hard', content: 'leaderboard_math_hard' },
];
