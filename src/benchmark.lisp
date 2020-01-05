; Basic Operations

  (test "add" (add 8 4 2) 14)
  (test "sub" (sub 8 4 2) 2)
  (test "mul" (mul 8 4 2) 64)
  (test "div" (div 8 4 2) 1)

; specials

( test "lambda" ((lambda (x) x) "Lisp") "Lisp")

; arrays

(test "map" (map (1 2 3) (lambda (a) (add 1 a))) (2 3 4))
