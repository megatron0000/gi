% 1º ano prova 1
 %X = [0.3333333333333333 0.5 0.2 0.6 0.5714285714285714 0.5 0.35714285714285715 0.5833333333333334 0 ;0.5 1 0.6 0.8 0.42857142857142855 0.75 0.5714285714285714 0.5833333333333334 1 ;0.16666666666666666 1 0.6 0.8 0.5714285714285714 1 0.5 0.6666666666666666 1 ;0.6666666666666666 0.5 0.4 0.8 0.5714285714285714 0.5 0.5 0.8333333333333334 1 ;0.3333333333333333 1 0.4 0.8 0.8571428571428571 0.75 0.7142857142857143 0.8333333333333334 1 ;0.8333333333333334 1 0.8 0.6 0.7142857142857143 0.5 0.6428571428571429 1 1 ;0.8333333333333334 1 1 0.8 0.5714285714285714 0.5 0.8571428571428571 0.9166666666666666 1 ;0.8333333333333334 1 0.6 0.8 0.8571428571428571 0.75 0.8571428571428571 1 1 ]

% 2º ano prova 1
X = [0.25 0.6666666666666666 0.5 0.8 0.4 0.4 0.4666666666666667 0.5833333333333334 0.6666666666666666 ;0.25 1 0.75 1 0.8 0.4 0.5333333333333333 0.5833333333333334 0.6666666666666666 ;0.5 1 0.5 1 0.8 0.8 0.5333333333333333 0.5833333333333334 0.6666666666666666 ;0.5 1 0.75 1 0.6 0.8 0.5333333333333333 0.6666666666666666 0.6666666666666666 ;1 1 1 1 0.4 0.6 0.6 0.8333333333333334 1 ;1 1 0.875 0.8 0.6 0.8 0.9333333333333333 0.9166666666666666 0.6666666666666666 ;1 1 0.875 0.8 1 1 0.9333333333333333 0.6666666666666666 1]

[U, S] = pca(X);

Ured = U(:,1:3);

fprintf('Vari�ncia retida');	
display((S(1,1)+S(2,2)+S(3,3))/sum(sum(S)))

Xred = X * Ured;

plot3(Xred(:,1), Xred(:,2), Xred(:,3),'o');
dx = 0.1 ; dy = 0.1 ; dz = 0.1;
%	{'Damke', 'Finamore', 'Balardin', 'Blanca', 'Mariana', 'Fer', 'Perez', 'Vitor'}
%	{'Ana', 'Rocha', 'Willian', 'Quadros', 'Camoico', 'Vitor', 'Secchi'}
text(Xred(:,1), Xred(:,2), Xred(:,3), {'Ana', 'Rocha', 'Willian', 'Quadros', 'Camoico', 'Vitor', 'Secchi'});
