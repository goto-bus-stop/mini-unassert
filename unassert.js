var transformAst = require('transform-ast')
var scan = require('scope-analyzer')
var isRequire = require('estree-is-require')

module.exports = unassert

function unassert (src, modules) {
  if (!modules) modules = ['assert']

  var requires = []
  var result = transformAst(src, function (node) {
    scan.visitScope(node)
    if (!isRequire(node)) return
    for (var i = 0; i < modules.length; i++) {
      if (isRequire(node, modules[i])) {
        requires.push(node)
        return
      }
    }
  })
  result.walk(scan.visitBinding)

  requires.forEach(function (node) {
    if (node.parent.type === 'VariableDeclarator') {
      var binding = scan.getBinding(node.parent.id)
      removeReferences(binding)
      if (!binding.isReferenced()) {
        removeDeclaration(node)
      }
    }
  })

  return result.toString({ map: true })
}

function removeReferences (binding) {
  binding.getReferences().forEach(function (ref) {
    var use = ref.parent
    if (use.type === 'MemberExpression' && use.object === ref) {
      use = use.parent
    }
    if (use.type === 'CallExpression') {
      use.callee.edit.update('void ')
      binding.remove(ref)
    }
  })
}

function removeDeclaration (node) {
  if (node.parent.type === 'VariableDeclarator' && node.parent.parent.declarations.length === 1) {
    node.parent.parent.edit.update(';')
  } else {
    node.parent.edit.update('')
  }
}
